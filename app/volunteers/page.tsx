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
import { Checkbox } from "@/components/ui/checkbox"; // may need to add shadcn checkbox
import { toast } from "sonner";

const WAIVER_TEXT = `LIABILITY WAIVER AND RELEASE
Hands On Community Renovation Project – Tina's House, Cayman Islands

I, the undersigned volunteer, understand that participation in construction, demolition, and renovation activities involves inherent risks including but not limited to injury from tools, falling objects, dust, uneven surfaces, and electrical/plumbing work.

By signing below (or checking the box), I voluntarily assume all risks and release the organizers, homeowners, and other volunteers from any liability for injury, loss, or damage arising from my participation.

I confirm I am physically fit, will follow all safety instructions, wear appropriate PPE, and will not participate if under the influence of alcohol or drugs.

I agree to follow all site rules and respect the property.

Date: ________________  Signature: ______________________`;

export const dynamic = "force-dynamic";

export default function VolunteersPage() {
  const { data, addDonation } = useHubData(); // reuse add pattern, but we'll use local for volunteers for simplicity in this demo
  const { isCore } = useRole();
  const [showSignup, setShowSignup] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    skills: [] as string[],
    availability: "",
    waiver_accepted: false,
  });

  // For demo we update local via a simple push (extend useHubData if needed)
  const [localVolunteers, setLocalVolunteers] = useState(data.volunteers);

  const handleSkillToggle = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const submitSignup = () => {
    if (!form.full_name || !form.email || !form.waiver_accepted) {
      toast.error("Please fill name, email and accept the waiver");
      return;
    }

    const newVol = {
      id: "v" + Date.now(),
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || undefined,
      skills: form.skills,
      availability: form.availability,
      waiver_signed: true,
      waiver_signed_at: new Date().toISOString(),
      hours_contributed: 0,
      created_at: new Date().toISOString(),
    };

    // Update local view
    setLocalVolunteers(prev => [newVol as any, ...prev]);

    // Also record as a "donation" of time for demo (optional)
    // In real would call a addVolunteer helper

    toast.success("Thank you! Waiver accepted. You're signed up for Hands On.");

    // Reset
    setForm({ full_name: "", email: "", phone: "", skills: [], availability: "", waiver_accepted: false });
    setShowSignup(false);
  };

  const allVols = [...localVolunteers, ...data.volunteers.filter((v: any) => !localVolunteers.some(lv => lv.id === v.id))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Volunteers</h1>
          <p className="text-[var(--text-muted)]">Sign up, track skills, and manage liability waivers (P0 requirement)</p>
        </div>

        <Dialog open={showSignup} onOpenChange={setShowSignup}>
          <DialogTrigger>
            <Button size="lg" className="gap-2">Sign Up as Volunteer</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Join the Hands On Team</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <Label>Full Name</Label>
                <Input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <Label>Phone (optional)</Label>
                  <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
              </div>

              <div>
                <Label>Skills (select all that apply)</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {["demo", "tiling", "painting", "carpentry", "electrical", "plumbing", "project-mgmt", "cleanup"].map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`text-xs px-3 py-1 rounded-full border ${form.skills.includes(skill) ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "border-[var(--border)]"}`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Availability</Label>
                <Input value={form.availability} onChange={e => setForm({...form, availability: e.target.value})} placeholder="e.g. Weekends + July 26-28" />
              </div>

              {/* Waiver */}
              <div className="border rounded-lg p-3 bg-[var(--surface-2)] text-xs">
                <div className="font-medium mb-1">Liability Waiver (required)</div>
                <div className="max-h-28 overflow-auto text-[var(--text-muted)] whitespace-pre-wrap font-mono text-[10px] leading-tight mb-2">
                  {WAIVER_TEXT}
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox 
                    id="waiver" 
                    checked={form.waiver_accepted} 
                    onChange={(e) => setForm({...form, waiver_accepted: e.target.checked})} 
                  />
                  <Label htmlFor="waiver" className="text-xs leading-tight cursor-pointer">
                    I have read, understand, and agree to the full liability waiver and release above.
                  </Label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowSignup(false)} className="flex-1">Cancel</Button>
                <Button onClick={submitSignup} disabled={!form.waiver_accepted} className="flex-1">Sign Up & Accept Waiver</Button>
              </div>
              <p className="text-[10px] text-center text-[var(--text-muted)]">Your info is only visible to Core Team.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {allVols.length === 0 && <p className="text-[var(--text-muted)]">No volunteers yet. Be the first!</p>}
        {allVols.map((v: any) => (
          <Card key={v.id} className="hub-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div>
                <div className="font-semibold">{v.full_name}</div>
                <div className="text-xs text-[var(--text-muted)]">{v.email} {v.phone && `• ${v.phone}`}</div>
                <div className="text-xs mt-1">Skills: {Array.isArray(v.skills) ? v.skills.join(", ") : v.skills}</div>
                {v.availability && <div className="text-xs mt-0.5">Available: {v.availability}</div>}
              </div>
              <div className="text-right">
                {v.waiver_signed ? (
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900">Waiver signed</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500 text-amber-700">Waiver pending — P0</Badge>
                )}
                {v.hours_contributed > 0 && <div className="text-xs mt-1 text-[var(--text-muted)]">{v.hours_contributed} hrs</div>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isCore && (
        <div className="text-xs text-[var(--text-muted)] text-center">
          Core Team: All contact info and waiver status visible here. Volunteers only see the public signup form.
        </div>
      )}

      <div className="text-center">
        <Link href="/" className="text-sm text-[var(--primary)]">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
