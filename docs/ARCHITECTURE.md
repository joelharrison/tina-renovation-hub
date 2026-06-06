# The Hub — Architecture & Implementation Plan
**Project:** Hands On Community Renovation — Tina's House, Cayman Islands  
**Display Name:** The Hub  
**Tagline:** One place for the team, volunteers, and donors to keep the renovation moving safely and on time.

## 1. Project Goals & Constraints
- Single source of truth for a community-driven residential renovation.
- Real-time visibility for distributed volunteers and donors.
- Prioritization driven by **Safety (P0)** and **Dependencies (P1)**.
- Key deadline: Demolition target ~ July 27 (adjust year as needed).
- Must support:
  - Core team (full edit)
  - Volunteers (view + sign-up + digital waivers)
  - Donors (view impact + pledge)
- Offline-friendly for site visits (local first).
- Easy CSV/PDF exports for meetings and reporting.
- Secure enough for personal contact info and liability docs.
- Beautiful, calm, mobile-first UI (people will use on phones at the house).

## 2. Tech Stack Decisions (Proposed)
- **Framework:** Next.js 16 (App Router) + TypeScript (already bootstrapped)
- **Styling:** Tailwind CSS v4 + shadcn/ui (beautiful accessible components, dark mode ready)
- **Data Layer (MVP):** 
  - Start with **client-side + localStorage** (instant, offline capable, no setup).
  - Optional path: **SQLite + Drizzle ORM** (local .db file, great for solo/dev).
  - Production path: **Supabase** (Postgres + Auth + Storage + Realtime) — user must opt-in.
- **Auth (MVP):** Role switcher (persisted) simulating 3 personas. Later: Supabase Auth (email + magic link or passwordless).
- **Forms:** react-hook-form + zod
- **Drag & Drop (Kanban):** @dnd-kit (light, accessible, modern) or graceful degradation to buttons.
- **Exports:** 
  - CSV: native or papaparse
  - PDF: jsPDF (client-side) + structured reports
- **Charts:** Recharts (lightweight) for budget & progress
- **Icons:** lucide-react (already installed)
- **Other:** date-fns, sonner (toasts), react-dropzone for uploads (MVP uses local URLs or base64)

**Why not full Supabase immediately?** To avoid blocking on external account creation. We can add a "Connect Supabase" flow later with clear migration steps.

## 3. Information Architecture & Navigation
Top-level nav (sticky, mobile bottom nav or hamburger):
- **Dashboard** (home)
- **Action Items** (Kanban + filters + priority matrix)
- **Materials** (inventory + status pipeline + shortages)
- **Donations** (tracker + pledge form)
- **Volunteers** (directory + sign-up + waivers)
- **Budget** (transactions + summaries + IOUs)
- **Documents** (uploads + categorized gallery + roof inspection)
- **Reports** (prioritization, exports, timeline)

Global elements:
- **Project header**: "The Hub • Hands On — Tina's Cayman House"
- **Role switcher** (Core Team / Volunteer / Donor) — affects visible actions + data visibility
- **Search** (global or per-page)
- "Export All" / "Print Report" buttons
- **Activity feed** (recent changes)

## 4. Database Schema (Supabase Postgres / Drizzle compatible)
All tables include: id (uuid or integer pk), created_at, updated_at.

### action_items
- title (text, required)
- description (text)
- priority (enum: 'P0' | 'P1' | 'P2' | 'P3')  — P0 = Safety/Critical, P1 = Dependencies, P2 = Value-add, P3 = Backlog
- status (enum: 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'done')
- area (text: 'Roof', 'Kitchen', 'Primary Bath', 'Guest Bath', 'Exterior', 'Mudroom', 'General', 'Electrical', 'Plumbing')
- assignee (text — name or volunteer email for MVP)
- due_date (date)
- estimated_hours (numeric)
- blocks (text[] — simple list of action titles/ids this blocks)
- depends_on (text[] — titles this waits for)
- notes (text)

### materials
- name (text)
- category (enum or text: Flooring, Roofing, Plumbing, Electrical, Drywall/Paint, Cabinets, Fixtures, Tools, Other)
- quantity_needed (numeric)
- unit (text: 'sqft', 'each', 'lf', 'gal', 'box', 'sheet', 'roll')
- quantity_on_hand (numeric default 0)
- quantity_ordered (numeric default 0)
- quantity_received (numeric default 0)
- quantity_installed (numeric default 0)
- unit_cost (numeric)
- total_est_cost (computed or stored)
- supplier (text)
- status ( 'needed' | 'sourcing' | 'ordered' | 'received' | 'installed' | 'donated-in-full' )
- priority (same P0-P3)
- linked_donation_ids (text[] for MVP)
- notes (text — e.g. "413 sqft porcelain for kitchen + baths")

### donations
- donor_name (text)
- donor_email/phone
- donation_type: 'cash' | 'in-kind-material' | 'in-kind-labor' | 'service' | 'tool-loan'
- description (text)
- estimated_value (numeric)
- material_id (fk optional — links specific material)
- status: 'pledged' | 'received' | 'confirmed' | 'thank-you-sent'
- received_at
- notes

### volunteers
- full_name
- email
- phone
- skills (text[] — e.g. ['tiling', 'demo', 'painting', 'project-mgmt'])
- preferred_areas
- availability (text or dates)
- waiver_signed (boolean default false)
- waiver_signed_at (timestamptz)
- waiver_document_url (text — Supabase storage path or data URL)
- hours_contributed (numeric default 0)
- notes (liability / special considerations)

### budget_entries
- type ('income-donation' | 'expense' | 'pledge' | 'in-kind-value' | 'iou-out' | 'iou-in')
- amount (numeric — always positive, use type to determine sign)
- description
- date
- category (Materials, Labor-Volunteer, Labor-Paid, Permits/Fees, Tools/Equipment, Contingency, Other)
- linked_donation_id (fk)
- linked_material_id (fk)
- receipt_url
- created_by

### documents
- title
- category ('Roof Inspection', 'Permit', 'Quote/Estimate', 'Contract', 'Progress Photo', 'Waiver', 'Invoice', 'Safety Report', 'Other')
- file_url (text)
- mime_type
- size_bytes
- related_to (text — 'roof' | action_item id | material id | 'general')
- uploaded_by
- uploaded_at
- description / ocr_notes (future)

### activity (simple audit / comms log)
- entity ( 'action_item' | 'material' | 'donation' | 'volunteer' | 'budget' | 'document' )
- entity_id
- type ( 'created' | 'status_changed' | 'comment' | 'pledge' | 'waiver_signed' )
- actor (name/role)
- payload (json — old/new values or comment text)
- created_at

**Views / Computed (in app or DB views later):**
- shortages: materials where quantity_received < quantity_needed
- critical_path: action_items filtered/sorted by P0 + P1 + due
- budget_summary: sum income vs expenses, % funded, remaining contingency
- volunteer_stats: signed count, total hours

## 5. Sample / Realistic Seed Data
Use numbers inspired by real lists (e.g. 413 sqft tile).

**Materials examples (partial):**
- Porcelain floor tile — 413 sqft needed, unit sqft, est $8.50/sqft, supplier: local Cayman or shipped, status: needed, P1 (goes under new flooring after demo)
- Roofing membrane / shingles — 1200 sqft, P0 (roof inspection first)
- Drywall 1/2" — 48 sheets
- Paint (exterior) — 15 gal
- Kitchen cabinets (IKEA or custom) — 1 set, high cost
- Toilet, vanity, shower fixtures for baths
- Electrical wire, outlets, switches, panel upgrade
- Lumber for framing / temporary supports

**Action Items examples:**
- P0: Complete roof inspection & report (owner: TBD, due: before July 20)
- P0: Obtain demolition permit
- P1: Demolition of kitchen & baths — target July 27
- P1: Order 413 sqft tile (lead time 3-4 weeks)
- P2: Recruit 4 volunteers for demo day (waivers required)
- etc.

**Donations, Volunteers, Budget lines:** Realistic names + Cayman-ish details, mix of cash pledges, in-kind tile/labor, tools.

Full seed data will live in `lib/sample-data.ts` and be loadable via a "Load Sample Data" button (with confirmation to avoid overwriting).

## 6. File / Folder Structure (Target)
tina-renovation-hub/ (or the-hub/)
- app/
  - (auth)/login etc if real auth
  - action-items/
  |   page.tsx   # Kanban + list + filters + new item modal
  - materials/
  |   page.tsx   # Searchable table + kanban pipeline view + shortage alerts
  - donations/
  |   page.tsx
  - volunteers/
  |   page.tsx   # List + "Become a Volunteer" form + waiver modal (jsPDF generated waiver preview)
  - budget/
  |   page.tsx   # Summary cards + transaction table + add entry + import CSV
  - documents/
  |   page.tsx   # Upload zone + grid + filter by category (roof inspection prominent)
  - reports/
  |   page.tsx   # Prioritization matrix, timeline, full export buttons
  - layout.tsx   # Top nav (tabs or sidebar), role switcher in header, project header "Hands On | The Hub - Tina's Cayman House"
  - page.tsx     # Main Dashboard: KPI cards (Total Budget $X, % Funded, Shortages: 5 items, Volunteers: 12 signed, Upcoming P0: 2, Timeline: 18 days to demo), quick actions, recent activity, priority summary
  - globals.css  # shadcn + custom
  - not-found.tsx
- components/
  - ui/ (from shadcn generated (Button, Card, Dialog, Badge, Table, Select, Input, Tabs, Calendar, etc.))
  - kanban/
  |   kanban-board.tsx
  - forms/
  |   volunteer-signup-form.tsx
  |   ...
  - export/
  |   export-buttons.tsx
  - shared/ (project-header, role-switcher, data-table, status-badge)
- lib/
  - db/ (if drizzle: schema.ts, client.ts)
  - supabase/ (if using)
  - types.ts (zod schemas + TS types for all entities)
  - sample-data.ts (export const seedActionItems = [...] etc. )
  - utils.ts (formatCurrency, formatDate, csv export, pdf report generators)
- docs/
  - ARCHITECTURE.md            # this file
- public/
- .env.example
- package.json
- (drizzle.config.ts | supabase/ folder when chosen)

## 7. Role-Based Behavior (MVP)
- **Core Team**: All create/edit/delete, see full budget numbers, edit any volunteer info, approve/decline pledges.
- **Volunteer**: Read-only on most lists, can claim action items (sign up), fill & sign waiver (generates simple PDF or text record), see public materials shortages (wish list).
- **Donor**: See high-level KPIs, materials needed list (with "I can donate this" quick pledge), donation history/impact, public timeline. Cannot see individual volunteer contact without consent.

All pages gracefully degrade features via `const canEdit = role === 'core_team'`

## 8. Security & Privacy Notes (MVP)
- No real passwords yet.
- Contact info only shown to core team.
- Waiver documents stored as data URLs or later in private Supabase bucket (RLS policies).
- All exports include only appropriate fields per role.
- Later: Supabase RLS + auth.jwt() claims for roles.

## 9. Phased Implementation (Step-by-Step)
We will ask for explicit confirmation before each major phase:
1. Project hygiene + shadcn/ui install + base layout/nav + types + sample data
2. Dashboard + KPI cards + role switcher
3. Action Items full Kanban (drag or buttons) + CRUD
4. Materials full CRUD + status workflow + search + links to donations
5. Donations + Volunteers + Waiver flow (form + "sign" that records + shows PDF)
6. Budget + Documents
7. Reports + exports (CSV + PDF)
8. Polish (dark mode, mobile, toasts, offline banner, AGENTS.md update)
9. (Optional) Drizzle local DB or Supabase wiring + realtime

## 10. Immediate Next Data Points Needed from You
- Exact materials list details if you have the Excel/PDF (quantities, costs, suppliers)
- Specific action items or meeting notes from the "Hands On - IRL Meeting" recording
- Target total budget figure or known cash on hand
- Any real volunteer/donor names to seed (or keep fictional)
- Preferred date format / currency (Cayman = KYD or USD?)

---

This plan will be the source of truth. We evolve it as we build.
