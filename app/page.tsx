"use client";

import React from "react";
import Link from "next/link";
import { 
  AlertTriangle, Users, Package, DollarSign, Clock, ArrowRight, 
  RefreshCw, Download, Upload 
} from "lucide-react";

import { useHubData } from "@/lib/data-store";
import { useRole } from "@/lib/role-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const { data, isLoaded, loadSampleData, exportJSON, kpis } = useHubData();
  const { isCore } = useRole();

  if (!isLoaded) {
    return <div className="p-8 text-center text-[var(--text-muted)]">Loading The Hub...</div>;
  }

  const {
    totalBudgetEst,
    cashReceived,
    inKindValue,
    fundedPct,
    shortages,
    p0Open,
    volunteersSigned,
    totalVolunteers,
    daysToDemo,
    upcomingActions,
  } = kpis;

  const recentActivity = [
    ...data.action_items.slice(0, 2).map((a: any) => ({ type: "action", text: a.title, time: a.updated_at })),
    ...data.donations.slice(0, 1).map((d: any) => ({ type: "donation", text: `${d.donor_name} — ${d.description}`, time: d.created_at })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Hero / Project status */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-[-1px]">Hands On — Cayman</h1>
          <Badge className="role-core">Demolition target: July 27</Badge>
        </div>
        <p className="text-[var(--text-muted)] max-w-2xl">
          Community renovation hub for Tina&apos;s house. Safety first (P0), then dependencies (P1). 
          Local data — everything saves in your browser.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="hub-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> TOTAL EST. BUDGET
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              ${totalBudgetEst.toLocaleString()}
            </div>
            <div className="text-xs mt-1 text-[var(--text-muted)]">
              {fundedPct}% funded (cash + in-kind)
            </div>
          </CardContent>
        </Card>

        <Card className="hub-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> CASH + IN-KIND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              ${(cashReceived + inKindValue).toLocaleString()}
            </div>
            <div className="text-xs mt-1 text-[var(--success)]">
              ${cashReceived.toLocaleString()} cash received
            </div>
          </CardContent>
        </Card>

        <Card className="hub-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> SHORTAGES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--warning)]">
              {shortages}
            </div>
            <div className="text-xs mt-1">Materials below target qty</div>
            <Link href="/materials" className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 mt-1">
              View inventory <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hub-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> P0 OPEN (SAFETY)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-red-600">
              {p0Open}
            </div>
            <div className="text-xs mt-1">Critical / safety items</div>
            <Link href="/action-items" className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 mt-1">
              Go to Kanban <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hub-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> VOLUNTEERS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              {volunteersSigned} / {totalVolunteers}
            </div>
            <div className="text-xs mt-1">Signed waivers</div>
            <Link href="/volunteers" className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 mt-1">
              Manage sign-ups <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hub-card border-[var(--warning)]/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> DAYS TO DEMO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--warning)]">
              {daysToDemo}
            </div>
            <div className="text-xs mt-1">Target: July 27, 2025</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-2">P0 roof inspection must clear first</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + data controls */}
      <div className="flex flex-wrap gap-3">
        {isCore && (
          <Button onClick={() => loadSampleData()} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" /> Load / Reset Sample Data
          </Button>
        )}
        <Button onClick={exportJSON} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export Full JSON
        </Button>
        <Button variant="outline" size="sm" className="gap-2" disabled>
          <Upload className="h-4 w-4" /> Import CSV (coming soon)
        </Button>
        <div className="text-xs self-center text-[var(--text-muted)] ml-2">
          All changes saved locally in this browser
        </div>
      </div>

      {/* Priority + Upcoming + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Critical Path Summary */}
        <Card className="hub-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" /> Priority Focus (P0 + P1)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.action_items
              .filter((a: any) => ["P0", "P1"].includes(a.priority) && a.status !== "done")
              .sort((a: any, b: any) => a.priority.localeCompare(b.priority) || (a.due_date || "").localeCompare(b.due_date || ""))
              .slice(0, 5)
              .map((item: any) => (
                <div key={item.id} className="flex justify-between border-l-2 pl-3" style={{ borderColor: item.priority === "P0" ? "#dc2626" : "#d97706" }}>
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">{item.area} • {item.assignee || "Unassigned"}</div>
                  </div>
                  <Badge className={item.priority === "P0" ? "priority-p0" : "priority-p1"}>{item.priority}</Badge>
                </div>
              ))}
            <Link href="/action-items" className="text-sm text-[var(--primary)] inline-flex items-center gap-1 pt-1">
              Open full Kanban <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="hub-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingActions.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No upcoming items with dates.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {upcomingActions.map(item => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.title}</span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">{item.due_date}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/action-items" className="block mt-3 text-sm text-[var(--primary)]">See all action items →</Link>
          </CardContent>
        </Card>

        {/* Recent Activity + Materials Snapshot */}
        <Card className="hub-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            {recentActivity.length === 0 && <div className="text-[var(--text-muted)]">No activity yet.</div>}
            {recentActivity.map((act, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-[var(--text-muted)] tabular-nums">{new Date(act.time).toLocaleDateString()}</span>
                <span>{act.text}</span>
              </div>
            ))}
            <div className="pt-2 border-t text-xs text-[var(--text-muted)]">
              Materials on hand: {data.materials.filter((m: any) => m.quantity_received > 0).length} items • {shortages} shortages
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="text-center text-sm text-[var(--text-muted)]">
        Jump to: <Link href="/materials" className="text-[var(--primary)] hover:underline">Materials Inventory</Link> • 
        <Link href="/volunteers" className="text-[var(--primary)] hover:underline"> Volunteer Sign-up + Waivers</Link> • 
        <Link href="/documents" className="text-[var(--primary)] hover:underline"> Roof Inspection Docs</Link>
      </div>

      {/* Data origin note */}
      <div className="text-center text-xs text-[var(--text-muted)] max-w-xl mx-auto pt-2">
        Initial data (actions, materials, timeline) was seeded from real project coordination chats. 
        The app is now a general-purpose tool for community renovations.
      </div>
    </div>
  );
}
