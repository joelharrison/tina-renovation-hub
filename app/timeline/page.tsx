"use client";

import React from "react";
import Link from "next/link";
import { useHubData } from "@/lib/data-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DEMO_DATE = "2025-07-27";
const START_DATE = "2025-07-01"; // start of visible timeline

export const dynamic = "force-dynamic";

export default function TimelinePage() {
  const { data } = useHubData();

  // Simple milestones derived from action items + fixed demo
  const milestones = [
    { date: "2025-07-18", label: "Roof Inspection (P0)", type: "critical", desc: "Structural report due before any demo" },
    { date: "2025-07-20", label: "Roofing materials on site", type: "material", desc: "Membrane + drip edge" },
    { date: "2025-07-22", label: "Demolition Permit", type: "critical", desc: "Must have roof report attached" },
    { date: "2025-07-27", label: "DEMOLITION DAY", type: "demo", desc: "Kitchen + Primary Bath down to studs. 6-8 volunteers needed." },
    { date: "2025-08-05", label: "Tile installation starts", type: "progress", desc: "After new subfloor and underlayment" },
  ];

  // Generate week columns from July 1 to mid August
  const weeks = [];
  let current = new Date(START_DATE);
  const end = new Date("2025-08-15");
  while (current <= end) {
    weeks.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 7);
  }

  const getPosition = (dateStr: string) => {
    const start = new Date(START_DATE).getTime();
    const endTime = new Date("2025-08-15").getTime();
    const d = new Date(dateStr).getTime();
    return ((d - start) / (endTime - start)) * 100;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Project Timeline</h1>
        <p className="text-[var(--text-muted)]">Key milestones leading to demolition on <strong>July 27, 2025</strong>. Mobile friendly Gantt view.</p>
      </div>

      {/* Simple CSS Gantt */}
      <Card className="hub-card p-4 overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Header weeks */}
          <div className="grid grid-cols-[120px_1fr] mb-2 text-xs text-[var(--text-muted)]">
            <div>Milestone</div>
            <div className="relative h-6 border-b border-[var(--border)]">
              {weeks.map((w, i) => (
                <div key={i} className="absolute text-[10px]" style={{ left: `${getPosition(w)}%` }}>
                  {new Date(w).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {milestones.map((m, idx) => {
              const pos = getPosition(m.date);
              const isDemo = m.type === "demo";
              return (
                <div key={idx} className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="font-medium truncate pr-2 flex items-center gap-2">
                    {m.label}
                    <Badge className={
                      m.type === "critical" ? "priority-p0" : 
                      m.type === "demo" ? "bg-red-600 text-white" : 
                      "priority-p1"
                    }>{m.date}</Badge>
                  </div>

                  {/* Timeline bar area */}
                  <div className="relative h-8 bg-[var(--surface-2)] rounded">
                    <div 
                      className={`absolute top-1 h-6 rounded flex items-center px-2 text-[10px] font-medium text-white ${isDemo ? "bg-red-600" : m.type === "critical" ? "bg-red-500" : "bg-[var(--primary)]"}`}
                      style={{ 
                        left: `${Math.max(0, pos)}%`, 
                        width: isDemo ? "60px" : "90px",
                      }}
                    >
                      {m.label.split(" ")[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Details list */}
      <div className="grid gap-3 md:grid-cols-2">
        {milestones.map((m, i) => (
          <Card key={i} className="hub-card p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{m.label}</div>
                <div className="text-xs text-[var(--text-muted)]">{m.date}</div>
              </div>
              <Badge className={m.type === "critical" || m.type === "demo" ? "priority-p0" : "priority-p1"}>{m.type}</Badge>
            </div>
            <p className="text-sm mt-2 text-[var(--text-muted)]">{m.desc}</p>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-[var(--text-muted)]">
        Timeline is illustrative. All dates and dependencies live in Action Items. Volunteers: use the signup form to claim tasks around these dates.
        <br />
        <Link href="/" className="text-[var(--primary)]">← Dashboard</Link>
      </div>
    </div>
  );
}
