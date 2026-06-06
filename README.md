# The Hub

**Hands On** — Community renovation command center for Tina's house in the Cayman Islands.

A production-ready, mobile-friendly web app for managing the community renovation project. Track action items (with priorities P0–P4), materials & inventory, donations, volunteers (with digital liability waivers), budget, documents (roof inspection etc.), and a visual timeline leading to the July 27 demolition.

## Features
- **Sidebar Navigation**: Persistent desktop sidebar + mobile drawer (hamburger).
- **Role-based Views**: Core Team (full edit), Volunteer (signup + view + waivers), Donor (impact + pledge). Switch in header.
- **Dashboard**: Live KPIs, P0 priority focus, upcoming deadlines, recent activity.
- **Action Items**: Drag-and-drop Kanban by status, priority color-coded badges, create/edit forms.
- **Materials**: Searchable inventory with status workflow (Needed → Installed), add forms, Excel import.
- **Donations & Volunteers**: Track pledges/donations, volunteer directory + full signup form with **liability waiver checkbox** (records signed state).
- **Budget & Documents**: Transaction tracking, categorized document gallery.
- **Timeline (Gantt)**: Visual CSS-based timeline from early July through demolition and beyond.
- **Reports & Exports**: 
  - Full PDF report (jsPDF) with KPIs, critical P0 items, budget summary, volunteers.
  - CSV exports for all / specific entities (materials, actions, volunteers, budget).
  - Raw JSON export.
- **Search / Filtering**: Global search bar in header (navigates to reports), per-page filters and searches (priority, status, text).
- **Notifications**: In-app bell icon with dropdown of recent events/activity. "Mock Email Team" button (demo; ready for Resend/Edge Function integration).
- **Real-time**: Supabase Realtime subscriptions on key tables (materials, actions, donations, volunteers). Falls back to localStorage.
- **Mobile-first**: Fully responsive for on-site volunteers (touch-friendly, stacked layouts, drawer nav).
- **Local-first + Cloud**: Works offline with browser persistence; syncs to Supabase when configured.
- **Data**: Realistic seed data (413 sqft tile, P0 roof inspection, July 27 demo, etc.).

## Tech Stack
- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind v4 + shadcn/ui (beautiful, accessible components)
- Supabase (Postgres + Auth + Realtime + Storage ready)
- Local fallback: localStorage + in-memory
- Exports: jsPDF (PDF), PapaParse (CSV), native JSON
- Forms: Dialogs + controlled state (easy to upgrade to react-hook-form)
- Drag & Drop: @dnd-kit for Kanban
- Deployment: Optimized for Vercel + Supabase

## Local Development Setup

### 1. Clone & Install
```bash
cd tina-renovation-hub
npm install
```

### 2. Supabase Setup (Recommended for full features + realtime)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and paste + run the entire contents of:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   (This creates the 5 tables + seeds realistic data from the materials/action lists.)
3. Copy your **Project URL** and **anon (public) key** from **Settings → API**.
4. Create `.env.local` (copy from `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
5. (Optional) For admin imports or service role actions, add `SUPABASE_SERVICE_ROLE_KEY`.

The app will automatically detect Supabase, fetch initial data, and enable realtime updates + form persistence to the cloud.

If no Supabase keys are provided, it runs 100% locally with sample data and localStorage.

### 3. Run
```bash
npm run dev
```
Open http://localhost:3000

- Use the **role switcher** in the top right to test different personas.
- Click **🌙** for dark mode.
- Try the **bell icon** for in-app notifications + mock email.
- Try **Load Sample Data** (visible to Core Team) on Dashboard if needed.
- Explore exports on the **Reports** page.

### 4. Seeding / Importing Data
- Built-in sample data on first load.
- Use the **Import Excel/CSV** buttons on Materials and Action Items pages.
- For PDF summaries: The import function accepts text files or you can paste extracted text.
- The SQL migration already includes seed INSERTs for the key items (tile quantities, roof P0, donations, volunteers with/without waivers, budget lines).

## Deployment (Vercel + Supabase)

### Vercel
1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add environment variables in Vercel dashboard (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Optional) Service role as a secret.
4. Deploy. The `vercel.json` is included for framework hints.

The app is serverless-friendly (all heavy logic client-side or via Supabase).

### Supabase Production Notes
- After deploying, enable **Row Level Security (RLS)** on the tables for security.
- Create policies so volunteers/donors can only read public data, while core_team (via auth) can write.
- Set up Supabase Auth (email/magic links) and map roles via user metadata or a `profiles` table.
- For real emails (beyond mock): Add [Resend](https://resend.com) integration or Supabase Edge Functions triggered on inserts (e.g., new donation → email core team).

Example RLS (run in SQL Editor):
```sql
-- Allow public read on most tables
create policy "Public can read" on materials for select using (true);
-- Similar for other tables. Restrict writes to authenticated core team.
```

## Environment Variables
See `.env.example` for full list and Vercel notes.

## Usage Tips
- **Core Team**: Full CRUD, see all contact info, approve implicitly via forms.
- **Volunteers**: Sign up via form (must check waiver), view public lists.
- **Donors**: View impact on dashboard/reports, use pledge forms.
- **Exports**: Always available; PDF is professional one-pager suitable for meetings.
- **Realtime**: Changes in one tab (or from Supabase dashboard) appear in others when Supabase is connected.
- **Offline**: Add/edit while offline — data saves locally and syncs on reconnect (manual refresh for demo).

## Architecture Notes
See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full DB schema, data models, and phased plan.

The Supabase schema matches the simplified tables requested (materials, action_items, donations, volunteers, budget_transactions) with seed data.

## Troubleshooting
- No realtime? Check Supabase keys and that you ran the migration SQL.
- Build issues? `npm run build` should be clean.
- Want email? The notification system is ready for a real provider — just replace the mock in the header.

Built with ❤️ for the Hands On team. Questions? Start by running the app locally with the steps above.

---

**Current Status**: Fully featured with exports, notifications, search/filtering, timeline, forms, role views, Supabase ready. Mobile-optimized for on-site use. Ready for Vercel + Supabase production deployment.
