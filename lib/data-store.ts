"use client";

import { useState, useEffect, useCallback } from "react";
import type { HubData } from "./types";
import { sampleHubData, computeKPIs } from "./sample-data";
import { toast } from "sonner";
import { supabase, isSupabaseEnabled } from "./supabase";
import jsPDF from "jspdf";
import Papa from "papaparse";

const STORAGE_KEY = "the-hub-data-v1";

export function useHubData() {
  const [data, setData] = useState<HubData>(sampleHubData);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [usingSupabase, setUsingSupabase] = useState(false);

  // Load from localStorage on mount + optional Supabase initial fetch
  useEffect(() => {
    let mounted = true;

    const loadLocal = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as HubData;
          if (parsed.action_items && parsed.materials) {
            setData(parsed);
          }
        }
      } catch (e) {
        console.warn("Failed to load saved hub data, using sample");
      }
    };

    const loadFromSupabase = async () => {
      if (!isSupabaseEnabled() || !supabase) return false;

      try {
        const [materialsRes, actionsRes, donationsRes, volunteersRes, budgetRes] = await Promise.all([
          supabase.from("materials").select("*").order("created_at", { ascending: false }),
          supabase.from("action_items").select("*").order("created_at", { ascending: false }),
          supabase.from("donations").select("*").order("created_at", { ascending: false }),
          supabase.from("volunteers").select("*").order("created_at", { ascending: false }),
          supabase.from("budget_transactions").select("*").order("date", { ascending: false }),
        ]);

        if (!mounted) return false;

        // Map Supabase rows to our local HubData shape (simplified mapping)
        const newData: HubData = {
          ...sampleHubData,
          materials: (materialsRes.data || []).map((m: any) => ({
            id: m.id,
            name: m.item,
            category: m.category || "other",
            quantity_needed: m.qty_needed || 0,
            unit: m.unit || "each",
            quantity_ordered: 0,
            quantity_received: 0,
            quantity_installed: 0,
            unit_cost: m.cost || 0,
            supplier: undefined,
            status: m.status || "needed",
            priority: "P1",
            notes: m.labor_notes || null,
            linked_donation_ids: [],
            created_at: m.created_at,
            updated_at: m.updated_at || m.created_at,
          })),
          action_items: (actionsRes.data || []).map((a: any) => ({
            id: a.id,
            title: a.title,
            description: a.description,
            priority: (a.priority || "P2"),
            status: (a.status || "todo"),
            area: "General",
            assignee: a.owner,
            due_date: a.due_date,
            estimated_hours: 0,
            blocks: [],
            depends_on: a.dependencies || [],
            notes: a.notes || undefined,
            created_at: a.created_at,
            updated_at: a.updated_at || a.created_at,
          })),
          donations: (donationsRes.data || []).map((d: any) => ({
            id: d.id,
            donor_name: d.donor,
            donor_email: undefined,
            donor_phone: undefined,
            type: "cash",
            description: d.item || "",
            estimated_value: d.value || 0,
            material_id: d.linked_material_id,
            status: (d.status || "pledged"),
            received_date: d.date,
            notes: d.notes || undefined,
            created_at: d.created_at,
          })),
          volunteers: (volunteersRes.data || []).map((v: any) => ({
            id: v.id,
            full_name: v.name,
            email: "volunteer@example.com",
            phone: undefined,
            skills: v.skills || [],
            availability: v.availability,
            preferred_areas: [],
            waiver_signed: !!v.waiver_signed,
            waiver_signed_at: undefined,
            hours_contributed: 0,
            notes: undefined,
            created_at: v.created_at,
          })),
          budget_entries: (budgetRes.data || []).map((b: any) => ({
            id: b.id,
            type: (b.type === "IOU" ? "iou-out" : b.type === "donation" ? "income" : b.type || "expense"),
            amount: b.amount || 0,
            description: b.notes || "Imported transaction",
            date: b.date || new Date().toISOString().slice(0, 10),
            category: "Materials",
            linked_donation_id: undefined,
            linked_material_id: undefined,
            receipt_url: undefined,
            created_by: "Supabase",
            created_at: b.created_at,
          })),
          documents: sampleHubData.documents,
          last_updated: new Date().toISOString(),
        };

        setData(newData);
        setUsingSupabase(true);
        return true;
      } catch (e) {
        console.warn("Supabase fetch failed, falling back to local", e);
        return false;
      }
    };

    (async () => {
      loadLocal();
      const usedSupa = await loadFromSupabase();
      if (!usedSupa) {
        // keep local
      }

      // Load notifications
      try {
        const savedNotifs = localStorage.getItem("the-hub-notifications");
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      } catch {}

      setIsLoaded(true);
    })();

    return () => { mounted = false; };
  }, []);

  // Persist on change (local only)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem("the-hub-notifications", JSON.stringify(notifications));
    } catch (e) {
      console.warn("Failed to persist hub data");
    }
  }, [data, isLoaded, notifications]);

  // Supabase Realtime subscriptions
  useEffect(() => {
    if (!isSupabaseEnabled() || !supabase || !isLoaded) return;

    const channel = supabase
      .channel("the-hub-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "materials" }, (payload) => {
        toast.info("Realtime: Materials updated");
        // Simple refetch approach for demo
        // In prod you'd merge payload.new intelligently
        window.location.reload(); // quick demo sync (or implement merge)
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "action_items" }, () => {
        toast.info("Realtime: Action Items updated");
        window.location.reload();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "donations" }, () => {
        toast.info("Realtime: Donations updated");
        window.location.reload();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "volunteers" }, () => {
        toast.info("Realtime: Volunteers updated");
        window.location.reload();
      })
      .subscribe();

    return () => {
      if (supabase) supabase.removeChannel(channel);
    };
  }, [isLoaded]);

  const updateData = useCallback((updater: (current: HubData) => HubData) => {
    setData(prev => {
      const next = updater(prev);
      return { ...next, last_updated: new Date().toISOString() };
    });
  }, []);

  const loadSampleData = useCallback((force = false) => {
    if (!force) {
      const confirmed = window.confirm(
        "Load fresh sample data? This will overwrite your current local changes."
      );
      if (!confirmed) return;
    }
    setData({ ...sampleHubData, last_updated: new Date().toISOString() });
    toast.success("Sample data loaded (realistic Cayman renovation data)");
  }, []);

  const resetAllData = useCallback(() => {
    const confirmed = window.confirm(
      "Reset everything to blank? You will lose all local data and sample."
    );
    if (!confirmed) return;
    const blank: HubData = {
      action_items: [],
      materials: [],
      donations: [],
      volunteers: [],
      budget_entries: [],
      documents: [],
      last_updated: new Date().toISOString(),
    };
    setData(blank);
    toast.info("All data cleared. Start fresh or load sample.");
  }, []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `the-hub-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Full data exported as JSON");
  }, [data]);

  const exportCSV = useCallback((type: 'all' | 'materials' | 'actions' | 'volunteers' | 'budget' = 'all') => {
    let csvData: any[] = [];
    let filename = 'the-hub-report';

    if (type === 'all' || type === 'materials') {
      csvData = [...csvData, ...data.materials.map((m: any) => ({ type: 'material', ...m }))];
    }
    if (type === 'all' || type === 'actions') {
      csvData = [...csvData, ...data.action_items.map((a: any) => ({ type: 'action', ...a }))];
    }
    if (type === 'all' || type === 'volunteers') {
      csvData = [...csvData, ...data.volunteers.map((v: any) => ({ type: 'volunteer', ...v }))];
    }
    if (type === 'all' || type === 'budget') {
      csvData = [...csvData, ...data.budget_entries.map((b: any) => ({ type: 'budget', ...b }))];
    }

    if (csvData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}-${type}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${type} as CSV`);
  }, [data]);

  const exportPDFReport = useCallback(() => {
    const doc = new jsPDF();
    const kpis = computeKPIs(data);
    const date = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text("The Hub - Hands On Renovation Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${date} | Project: Tina's Cayman House | Demolition: July 27, 2025`, 20, 28);

    // KPIs
    doc.setFontSize(14);
    doc.text("Key Performance Indicators", 20, 40);
    doc.setFontSize(11);
    doc.text(`Total Est. Budget: $${kpis.totalBudgetEst.toLocaleString()}`, 20, 48);
    doc.text(`Funded: ${kpis.fundedPct}% (Cash: $${kpis.cashReceived.toLocaleString()} + In-Kind: $${kpis.inKindValue.toLocaleString()})`, 20, 54);
    doc.text(`Open P0 (Safety) Items: ${kpis.p0Open}`, 20, 60);
    doc.text(`Materials Shortages: ${kpis.shortages}`, 20, 66);
    doc.text(`Volunteers Signed: ${kpis.volunteersSigned} / ${kpis.totalVolunteers}`, 20, 72);
    doc.text(`Days to Demolition: ${kpis.daysToDemo}`, 20, 78);

    // Open P0 Actions
    doc.setFontSize(14);
    doc.text("Critical Open P0 Items", 20, 90);
    doc.setFontSize(10);
    const p0Items = data.action_items.filter((a: any) => a.priority === "P0" && a.status !== "done");
    let y = 98;
    p0Items.slice(0, 8).forEach((item: any, i: number) => {
      doc.text(`${i+1}. ${item.title} - ${item.due_date || 'TBD'} (${item.assignee || 'Unassigned'})`, 20, y);
      y += 6;
    });

    // Budget Summary
    y += 10;
    doc.setFontSize(14);
    doc.text("Recent Budget Activity", 20, y);
    y += 8;
    doc.setFontSize(10);
    data.budget_entries.slice(0, 6).forEach((b: any) => {
      doc.text(`${b.date}: ${b.description} - $${b.amount} (${b.type})`, 20, y);
      y += 6;
    });

    // Volunteers
    y += 8;
    doc.setFontSize(14);
    doc.text("Volunteer Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    data.volunteers.filter((v: any) => v.waiver_signed).slice(0, 5).forEach((v: any) => {
      doc.text(`- ${v.full_name} (${v.skills?.join(', ') || 'general'}) - ${v.hours_contributed || 0} hrs`, 20, y);
      y += 6;
    });

    doc.save(`the-hub-report-${new Date().toISOString().slice(0,10)}.pdf`);
    toast.success("PDF Report generated and downloaded");

    // Add notification
    addNotification({ id: Date.now(), type: 'export', message: 'PDF Report exported', time: new Date().toISOString() });
  }, [data]);

  const addNotification = useCallback((notif: any) => {
    const newNotif = { ...notif, id: notif.id || Date.now() };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20)); // keep last 20
  }, []);

  // Expose a way to trigger notifications from actions (e.g. after form submit)
  const notify = useCallback((message: string, type = 'info') => {
    addNotification({ id: Date.now(), type, message, time: new Date().toISOString() });
    toast(message);
  }, [addNotification]);


  // Supabase-aware add helpers (used by forms)
  const addActionItem = useCallback(async (item: any) => {
    const newItem = {
      ...item,
      id: item.id || "a" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseEnabled() && supabase) {
      try {
        await supabase.from("action_items").insert({
          title: newItem.title,
          description: newItem.description,
          owner: newItem.assignee,
          status: newItem.status,
          priority: newItem.priority,
          due_date: newItem.due_date,
          dependencies: newItem.depends_on || [],
        });
        toast.success("Action added to Supabase (realtime will sync)");
      } catch (e) {
        toast.error("Supabase insert failed, saved locally");
      }
    }

    updateData((current: any) => ({
      ...current,
      action_items: [newItem, ...current.action_items],
    }));
  }, [updateData]);

  const addMaterial = useCallback(async (mat: any) => {
    const newMat = {
      ...mat,
      id: mat.id || "m" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseEnabled() && supabase) {
      try {
        await supabase.from("materials").insert({
          item: newMat.name,
          qty_needed: newMat.quantity_needed,
          unit: newMat.unit,
          cost: newMat.unit_cost,
          status: newMat.status,
          category: newMat.category,
          labor_notes: newMat.notes,
        });
        toast.success("Material added to Supabase");
      } catch (e) {
        toast.error("Saved locally only");
      }
    }

    updateData((current: any) => ({
      ...current,
      materials: [newMat, ...current.materials],
    }));
  }, [updateData]);

  const addDonation = useCallback(async (don: any) => {
    const newDon = {
      ...don,
      id: don.id || "d" + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseEnabled() && supabase) {
      try {
        await supabase.from("donations").insert({
          donor: newDon.donor_name,
          item: newDon.description,
          value: newDon.estimated_value,
          date: newDon.received_date,
          status: newDon.status,
          linked_material_id: newDon.material_id,
        });
        toast.success("Donation recorded in Supabase");
      } catch (e) {
        toast.error("Saved locally");
      }
    }

    updateData((current: any) => ({
      ...current,
      donations: [newDon, ...current.donations],
    }));
  }, [updateData]);

  const kpis = computeKPIs(data);

  return {
    data,
    isLoaded,
    usingSupabase,
    updateData,
    addActionItem,
    addMaterial,
    addDonation,
    loadSampleData,
    resetAllData,
    exportJSON,
    exportCSV,
    exportPDFReport,
    notifications,
    addNotification,
    notify,
    kpis,
  };
}
