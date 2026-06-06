"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useHubData } from "@/lib/data-store";
import { useRole } from "@/lib/role-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { importMaterialsFromExcel } from "@/lib/import-utils";

const MATERIAL_STATUSES = ["needed", "sourcing", "ordered", "received", "installed", "donated-in-full"] as const;

export const dynamic = "force-dynamic";

export default function MaterialsPage() {
  const { data, addMaterial, updateData } = useHubData();
  const { isCore } = useRole();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newMat, setNewMat] = useState({
    name: "",
    category: "Flooring",
    quantity_needed: 1,
    unit: "each",
    unit_cost: 0,
    status: "needed",
    notes: "",
  });

  const filtered = data.materials.filter((m: any) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase()) ||
    (m.notes || "").toLowerCase().includes(search.toLowerCase())
  );

  function advanceStatus(id: string) {
    updateData((current: any) => {
      const items = current.materials.map((m: any) => {
        if (m.id !== id) return m;
        const idx = MATERIAL_STATUSES.indexOf(m.status);
        const next = MATERIAL_STATUSES[Math.min(idx + 1, MATERIAL_STATUSES.length - 1)];
        const updates: any = { status: next, updated_at: new Date().toISOString() };
        if (next === "received" || next === "installed") {
          updates.quantity_received = Math.max(m.quantity_received, m.quantity_needed);
        }
        return { ...m, ...updates };
      });
      return { ...current, materials: items };
    });
    toast.success("Status advanced");
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Materials &amp; Inventory</h1>
          <p className="text-[var(--text-muted)] text-sm">413 sqft tile example • real-time status • linked to donations</p>
        </div>
        {isCore && <Button size="sm" onClick={() => toast.info("Add material form coming in next iteration")}>+ Add Material</Button>}
      </div>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <Input 
          placeholder="Search materials (tile, roof, paint...)" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="max-w-sm" 
        />
        {isCore && (
          <>
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      await importMaterialsFromExcel(file);
                      toast.success("Import processed. Reload or sync data to see updates.");
                    } catch (err) {
                      toast.error("Import failed: " + (err as Error).message);
                    }
                  }
                  e.target.value = ''; // reset
                }} 
              />
              <Button variant="outline" size="sm" type="button">Import Excel/CSV</Button>
            </label>

            <Dialog open={showAdd} onOpenChange={setShowAdd}>
              <DialogTrigger>
                <Button size="sm">+ Add Material</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Material</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label>Item Name</Label>
                    <Input value={newMat.name} onChange={e => setNewMat({...newMat, name: e.target.value})} placeholder="e.g. Porcelain Tile 12x24" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <select value={newMat.category} onChange={(e) => setNewMat({...newMat, category: e.target.value || "Flooring"})} className="border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-sm w-full">
                        <option value="Flooring">Flooring / tile</option>
                        <option value="Roofing">Roofing</option>
                        <option value="Paint">Paint</option>
                        <option value="Drywall">Drywall</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Cabinets">Cabinets</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select value={newMat.status} onChange={(e) => setNewMat({...newMat, status: e.target.value || "needed"})} className="border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-sm w-full">
                        <option value="needed">Needed</option>
                        <option value="sourcing">Sourcing</option>
                        <option value="ordered">Ordered</option>
                        <option value="received">Received</option>
                        <option value="installed">Installed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Qty Needed</Label>
                      <Input type="number" value={newMat.quantity_needed} onChange={e => setNewMat({...newMat, quantity_needed: parseFloat(e.target.value) || 0})} />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Input value={newMat.unit} onChange={e => setNewMat({...newMat, unit: e.target.value})} />
                    </div>
                    <div>
                      <Label>Unit Cost ($)</Label>
                      <Input type="number" step="0.01" value={newMat.unit_cost} onChange={e => setNewMat({...newMat, unit_cost: parseFloat(e.target.value) || 0})} />
                    </div>
                  </div>
                  <div>
                    <Label>Labor / Notes</Label>
                    <Input value={newMat.notes} onChange={e => setNewMat({...newMat, notes: e.target.value})} placeholder="Special instructions or supplier" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" onClick={() => setShowAdd(false)} className="flex-1">Cancel</Button>
                    <Button onClick={() => {
                      if (!newMat.name) return;
                      addMaterial({
                        name: newMat.name,
                        category: newMat.category,
                        quantity_needed: newMat.quantity_needed,
                        unit: newMat.unit,
                        unit_cost: newMat.unit_cost,
                        status: newMat.status,
                        notes: newMat.notes || null,
                        priority: "P1",
                      });
                      setShowAdd(false);
                      setNewMat({ name: "", category: "Flooring", quantity_needed: 1, unit: "each", unit_cost: 0, status: "needed", notes: "" });
                    }} className="flex-1">Add Material</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>

      <div className="grid gap-3">
        {filtered.map((m: any) => {
          const covered = m.quantity_received + m.quantity_ordered;
          const pct = Math.min(100, Math.round((covered / Math.max(1, m.quantity_needed)) * 100));
          const priorityClass = m.priority === "P0" ? "priority-p0" : m.priority === "P1" ? "priority-p1" : "priority-p2";

          return (
            <Card key={m.id} className="hub-card p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{m.category} • {m.quantity_needed} {m.unit} @ ${m.unit_cost} • {m.supplier || "TBD"}</div>
                  {m.notes && <div className="text-xs mt-1 text-[var(--text-muted)]">{m.notes}</div>}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-sm tabular-nums">
                    {covered} / {m.quantity_needed} {m.unit}<br />
                    <span className="text-[10px] text-[var(--text-muted)]">{pct}% covered</span>
                  </div>

                  <Badge className={priorityClass}>{m.priority}</Badge>
                  <Badge>{m.status}</Badge>

                  {isCore && (
                    <Button size="sm" variant="outline" onClick={() => advanceStatus(m.id)}>
                      Advance →
                    </Button>
                  )}
                </div>
              </div>

              {m.linked_donation_ids?.length > 0 && (
                <div className="mt-2 text-xs text-emerald-700">Linked to donation(s)</div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="text-center py-8 text-[var(--text-muted)]">No matches.</div>}

      <div className="mt-8 text-xs text-center text-[var(--text-muted)]">
        Full table view, quantity editing, CSV import, and donation linking in next steps.
        <Link href="/" className="ml-2 text-[var(--primary)]">← Dashboard</Link>
      </div>
    </div>
  );
}
