"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useHubData } from "@/lib/data-store";
import { useRole } from "@/lib/role-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function DonationsPage() {
  const { data, addDonation } = useHubData();
  const { isCore } = useRole();
  const [showAdd, setShowAdd] = useState(false);
  const [newDon, setNewDon] = useState({ donor_name: "", description: "", estimated_value: 100, type: "cash", status: "pledged" });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Donations Tracker</h1>
        {isCore && (
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger><Button size="sm">+ Record Donation / Pledge</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record New Donation or Pledge</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div><Label>Donor / Company</Label><Input value={newDon.donor_name} onChange={e=>setNewDon({...newDon, donor_name:e.target.value})} /></div>
                <div><Label>Description</Label><Input value={newDon.description} onChange={e=>setNewDon({...newDon, description:e.target.value})} placeholder="Cash / Tile / Labor" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Value ($)</Label><Input type="number" value={newDon.estimated_value} onChange={e=>setNewDon({...newDon, estimated_value:parseFloat(e.target.value)||0})} /></div>
                  <div><Label>Type</Label>
                    <select value={newDon.type} onChange={(e) => setNewDon({...newDon, type: (e.target.value || "cash") as any})} className="border border-[var(--border)] bg-[var(--surface)] rounded px-2 py-1 text-sm w-full">
                      <option value="cash">Cash</option>
                      <option value="in-kind-material">In-kind Material</option>
                      <option value="in-kind-labor">In-kind Labor</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={()=>setShowAdd(false)} className="flex-1">Cancel</Button>
                  <Button onClick={() => {
                    if (!newDon.donor_name) return;
                    addDonation(newDon);
                    setShowAdd(false);
                    setNewDon({ donor_name: "", description: "", estimated_value: 100, type: "cash", status: "pledged" });
                  }} className="flex-1">Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-3">
        {data.donations.map((d: any) => (
          <Card key={d.id} className="hub-card p-4 text-sm">
            <div className="font-medium">{d.donor_name} — {d.description}</div>
            <div>${d.estimated_value?.toLocaleString()} • {d.type} • {d.status}</div>
          </Card>
        ))}
      </div>
      <p className="text-xs mt-6 text-center text-[var(--text-muted)]">Thank you to all donors! Realtime updates when connected to Supabase. <Link href="/" className="text-[var(--primary)]">Back to dashboard</Link></p>
    </div>
  );
}
