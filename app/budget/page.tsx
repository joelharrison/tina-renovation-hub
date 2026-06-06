"use client";
import Link from "next/link";
import { useHubData } from "@/lib/data-store";
import { Card } from "@/components/ui/card";

export default function BudgetPage() {
  const { data, kpis } = useHubData();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Budget Tracker</h1>
      <p className="mb-4 text-sm text-[var(--text-muted)]">Cash, in-kind, IOUs. Total est ${kpis.totalBudgetEst.toLocaleString()} • Funded {kpis.fundedPct}%</p>
      <div className="space-y-2">
        {data.budget_entries.map((b: any) => (
          <Card key={b.id} className="hub-card p-3 text-sm flex justify-between">
            <span>{b.description}</span>
            <span className={b.type === "income" || b.type === "in-kind" ? "text-[var(--success)]" : ""}>
              {b.type === "expense" ? "-" : "+"}${b.amount.toLocaleString()}
            </span>
          </Card>
        ))}
      </div>
      <p className="text-xs mt-6 text-center text-[var(--text-muted)]">Add entry form, charts, and CSV import next. <Link href="/" className="text-[var(--primary)]">Dashboard</Link></p>
    </div>
  );
}
