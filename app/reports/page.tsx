"use client";
import Link from "next/link";
import { useHubData } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRole } from "@/lib/role-context";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const { exportJSON, exportCSV, exportPDFReport, data, kpis } = useHubData();
  const { isCore } = useRole();

  const p0Items = data.action_items.filter((a: any) => a.priority === "P0" && a.status !== "done");
  const shortages = data.materials.filter((m: any) => (m.quantity_received + m.quantity_ordered) < m.quantity_needed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reports &amp; Prioritization</h1>
        <p className="text-[var(--text-muted)]">Generate exports, view critical path, shortages, and team status. All exports respect your current role.</p>
      </div>

      {/* Quick KPIs Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hub-card p-4">
          <div className="text-xs text-[var(--text-muted)]">Total Budget</div>
          <div className="text-2xl font-semibold tabular-nums">${kpis.totalBudgetEst.toLocaleString()}</div>
        </Card>
        <Card className="hub-card p-4">
          <div className="text-xs text-[var(--text-muted)]">Funded</div>
          <div className="text-2xl font-semibold tabular-nums">{kpis.fundedPct}%</div>
        </Card>
        <Card className="hub-card p-4">
          <div className="text-xs text-[var(--text-muted)]">Open P0 Items</div>
          <div className="text-2xl font-semibold tabular-nums text-red-600">{kpis.p0Open}</div>
        </Card>
        <Card className="hub-card p-4">
          <div className="text-xs text-[var(--text-muted)]">Volunteers Signed</div>
          <div className="text-2xl font-semibold tabular-nums">{kpis.volunteersSigned}</div>
        </Card>
      </div>

      {/* Export Controls */}
      <Card className="hub-card p-6">
        <h2 className="font-semibold mb-4">Export Reports</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => exportPDFReport()} variant="default">Download Full PDF Report</Button>
          <Button onClick={() => exportCSV('all')} variant="outline">Export All Data (CSV)</Button>
          <Button onClick={() => exportCSV('materials')} variant="outline">Materials CSV</Button>
          <Button onClick={() => exportCSV('actions')} variant="outline">Action Items CSV</Button>
          <Button onClick={() => exportCSV('volunteers')} variant="outline">Volunteers CSV</Button>
          <Button onClick={() => exportCSV('budget')} variant="outline">Budget CSV</Button>
          <Button onClick={() => exportJSON()} variant="outline">Raw JSON</Button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-3">PDF includes KPIs, open P0s, budget summary, and volunteer list. CSVs are filtered by role where appropriate.</p>
      </Card>

      {/* Critical Path & Shortages */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hub-card p-6">
          <h2 className="font-semibold mb-3 text-red-600">Open P0 Safety Items ({p0Items.length})</h2>
          {p0Items.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No open P0 items. Great work!</p>
          ) : (
            <ul className="text-sm space-y-2">
              {p0Items.map((item: any) => (
                <li key={item.id} className="flex justify-between border-l-2 border-red-500 pl-2">
                  <span>{item.title}</span>
                  <span className="text-xs text-[var(--text-muted)]">{item.due_date || 'TBD'}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="hub-card p-6">
          <h2 className="font-semibold mb-3 text-amber-600">Materials Shortages ({shortages.length})</h2>
          {shortages.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">All materials sufficiently covered.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {shortages.slice(0, 6).map((m: any) => (
                <li key={m.id}>{m.name} — {m.quantity_needed} {m.unit} needed</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm text-[var(--primary)]">← Back to Dashboard</Link>
      </div>
    </div>
  );
}
