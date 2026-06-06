"use client";

import Link from "next/link";
import { useHubData } from "@/lib/data-store";
import { useRole } from "@/lib/role-context";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default function DocumentsPage() {
  const { data } = useHubData();
  const { isCore } = useRole();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Documents &amp; Photos</h1>
      <p className="text-[var(--text-muted)] mb-6">Roof inspection (P0), permits, quotes, progress photos, signed waivers.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {data.documents.map((doc: any) => (
          <Card key={doc.id} className="hub-card p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{doc.title}</div>
                <div className="text-xs text-[var(--text-muted)]">{doc.category} • {doc.uploaded_at.slice(0,10)}</div>
                {doc.description && <div className="text-xs mt-1">{doc.description}</div>}
              </div>
              <Badge>{doc.category}</Badge>
            </div>
            {doc.related_to === "roof" && (
              <div className="mt-2 text-xs text-red-600 font-medium">P0 — Roof gate document</div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 text-xs text-center text-[var(--text-muted)]">
        Drag &amp; drop upload (local data URLs for MVP) + PDF/photo preview + category filters coming in next steps.
        <Link href="/" className="ml-2 text-[var(--primary)]">← Dashboard</Link>
      </div>
    </div>
  );
}
