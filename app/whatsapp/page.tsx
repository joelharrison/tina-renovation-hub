"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * WhatsApp Live integration has been disconnected for the public / self-contained version of The Hub.
 * 
 * During active development of this specific project, the page used the connected WhatsApp MCP tools
 * (in the Grok environment) to listen to the real "Hands On @Tina’s" and "Hands On" groups and
 * turn messages into action items, materials, etc.
 *
 * For a general, deployable app that anyone can use for their own renovation projects, that live
 * connection does not make sense. The core features (action items, materials, volunteers, donations, budget,
 * timeline, reports, exports, Supabase sync) are now fully standalone.
 *
 * If you want to add real WhatsApp integration later, you would typically use the WhatsApp Business
 * API + webhooks (or a service like Twilio, MessageBird, or Wati) and store messages in your own DB.
 */

export const dynamic = "force-dynamic";

export default function WhatsAppPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">WhatsApp Live</h1>
        <p className="text-[var(--text-muted)] mt-1">
          This feature has been disconnected in the public version of The Hub.
        </p>
      </div>

      <Card className="hub-card p-6">
        <div className="space-y-4 text-sm">
          <p>
            During development of <strong>The Hub</strong> for the Hands On Cayman renovation, 
            we used direct access to the project’s private WhatsApp groups (via the environment’s tools) 
            to pull real coordination messages and turn them into structured data.
          </p>

          <p>
            That live connection was specific to this one project and the current chat session. 
            It is not included in the open, deployable app so that anyone can use The Hub for their own team or renovation.
          </p>

          <div className="pt-2 border-t border-[var(--border)]">
            <div className="font-medium mb-1">What’s still in the app:</div>
            <ul className="list-disc pl-5 space-y-0.5 text-[var(--text-muted)]">
              <li>Realistic sample data (originally inspired by the chat activity)</li>
              <li>Action Items, Materials, Volunteers, Donations, Budget, Timeline, Reports, Exports</li>
              <li>Supabase sync + realtime (when you configure your own project)</li>
              <li>Role-based views and mobile-friendly UI</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Link href="/">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <p className="text-center text-[10px] text-[var(--text-muted)]">
        Future versions could add optional WhatsApp Business API integration for any team’s own groups.
      </p>
    </div>
  );
}
