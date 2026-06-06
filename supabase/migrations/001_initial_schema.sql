-- Supabase/Postgres Schema for The Hub - Hands On Renovation Project
-- Run this in Supabase SQL editor or via migration tool.
-- Tables as specified by user, with sensible additions (ids, timestamps, constraints).

-- Enable UUID extension if not already
create extension if not exists "uuid-ossp";

-- ============================================
-- MATERIALS
-- ============================================
create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  item text not null,
  qty_needed numeric not null default 0,
  unit text,
  cost numeric,  -- unit cost
  status text check (status in ('needed','sourcing','ordered','received','installed','donated-in-full')) default 'needed',
  category text,  -- e.g. tile, paint, flooring, roofing, plumbing, electrical, drywall, cabinets, fixtures, other
  labor_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- ACTION_ITEMS
-- ============================================
create table if not exists action_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  owner text,  -- e.g. assignee or volunteer name
  status text check (status in ('backlog','todo','in_progress','blocked','done')) default 'backlog',
  priority text check (priority in ('P0','P1','P2','P3','P4')) default 'P2',
  due_date date,
  dependencies text[],  -- array of action titles or ids this depends on
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- DONATIONS
-- ============================================
create table if not exists donations (
  id uuid primary key default uuid_generate_v4(),
  donor text not null,
  item text,  -- description of donated item or "cash"
  value numeric,
  date date default current_date,
  status text check (status in ('pledged','received','confirmed','thank-you-sent')) default 'pledged',
  linked_material_id uuid references materials(id) on delete set null,
  created_at timestamptz default now()
);

-- ============================================
-- VOLUNTEERS
-- ============================================
create table if not exists volunteers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  skills text[],  -- e.g. ['tiling', 'demo', 'painting']
  availability text,
  waiver_signed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- BUDGET_TRANSACTIONS
-- ============================================
create table if not exists budget_transactions (
  id uuid primary key default uuid_generate_v4(),
  date date default current_date,
  amount numeric not null,
  type text check (type in ('cash','donation','IOU','expense','in-kind')) default 'cash',
  notes text,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_materials_status on materials(status);
create index if not exists idx_action_items_priority_status on action_items(priority, status);
create index if not exists idx_donations_status on donations(status);
create index if not exists idx_volunteers_waiver on volunteers(waiver_signed);
create index if not exists idx_budget_date on budget_transactions(date);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
-- Enable RLS on all tables (required by Supabase for security).
-- For MVP / small trusted group (shared via WhatsApp link):
--   - Allow public read access (anon key)
--   - Allow inserts/updates/deletes for now (we'll tighten this once real auth is added)

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON materials FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON action_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON donations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON volunteers FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON budget_transactions FOR ALL USING (true) WITH CHECK (true);

-- Note for production:
-- Once you add Supabase Auth, replace the above with more restrictive policies, e.g.:
-- CREATE POLICY "Authenticated users can read" ON materials FOR SELECT USING (auth.role() = 'authenticated');
-- Core team members could use service_role key or custom claims for writes.

-- ============================================
-- SEED DATA from earlier materials list and action items
-- (adapted to the requested simplified column names)
-- ============================================

-- Seed Materials (from sample: tiles 413+ sqft, roofing, drywall, paint, cabinets, plumbing)
insert into materials (item, qty_needed, unit, cost, status, category, labor_notes) values
('Porcelain Floor Tile 12x24 (sand)', 473, 'sqft', 8.75, 'needed', 'tile', '413 sqft main areas + 15% waste + 60 sqft for guest bath. Sample board approved. P1 dependency after demo.'),
('Self-leveling underlayment + thinset', 12, 'bag', 42, 'needed', 'flooring', 'For tile prep after demo.'),
('Roofing membrane (peel & stick) + drip edge', 1250, 'sqft', 3.8, 'received', 'roofing', 'P0 — roof inspection dependent. 600 sqft arrived.'),
('1/2" Drywall (4x8 sheets)', 52, 'sheet', 18.5, 'received', 'drywall', 'For new walls after demo + some repairs.'),
('Exterior paint (beige/cream, weatherproof)', 18, 'gal', 68, 'sourcing', 'paint', 'High quality for Cayman climate.'),
('Kitchen base + wall cabinets (custom or semi-custom)', 1, 'set', 4200, 'needed', 'cabinets', 'High cost item. Possible in-kind from donor.'),
('Shower valve + trim kit (2 baths)', 3, 'each', 185, 'needed', 'plumbing', 'Delta / Moen authorized. For primary + guest bath.');

-- Seed Action Items (adapted from sample, priorities P0-P2 as P4 not used yet, owner from assignee)
insert into action_items (title, description, owner, status, priority, due_date, dependencies) values
('Complete roof inspection & structural report', 'Critical before any demolition. Inspector scheduled. Check for hurricane tie-downs. Roof inspection is the #1 safety gate.', 'Core Team - Joel', 'in_progress', 'P0', '2025-07-18', null),
('Obtain demolition permit from Cayman planning', 'Submit forms + pay fees. Need roof report attached.', 'Core Team - Tina', 'todo', 'P0', '2025-07-22', array['Complete roof inspection & structural report']),
('Demolish kitchen + primary bath down to studs', 'Target date July 27. Need 6-8 volunteers + skip bin arranged. Coordinate with skip company. Safety briefing required.', 'Volunteer Lead', 'todo', 'P1', '2025-07-27', array['Obtain demolition permit from Cayman planning']),
('Order 413 sqft porcelain floor tile (kitchen + baths)', 'Porcelain 12x24, light sand color. Local supplier or Miami ship. 15% overage recommended. 413 sqft + 60 sqft overage = ~473 sqft total order.', 'Core Team', 'todo', 'P1', '2025-07-10', array['Demolish kitchen + primary bath down to studs']),
('Sign up & collect signed waivers from all demo volunteers', 'Use The Hub waiver form. Print extras for day-of.', 'Volunteer Coordinator', 'in_progress', 'P0', '2025-07-25', null),
('Install temporary power + dust containment for demo', 'For safe demo day operations.', 'Electrical volunteer', 'backlog', 'P1', '2025-07-26', null),
('Source + order roofing membrane / drip edge (1200 sqft)', 'P0 — roof inspection dependent.', 'Core Team', 'todo', 'P0', '2025-07-20', array['Complete roof inspection & structural report']),
('Recruit 2-3 painters for exterior + interior prep', 'For post-demo finishing.', 'Volunteer Coordinator', 'todo', 'P2', '2025-08-05', null);

-- Seed Donations (mapped)
insert into donations (donor, item, value, date, status, linked_material_id) values
('North Side Church', 'General renovation fund donation (cash)', 3500, '2025-06-28', 'received', null),
('Mike & Sarah Thompson', '413 sqft porcelain tile + underlayment (full amount)', 4200, '2025-07-01', 'pledged', (select id from materials where item like 'Porcelain Floor Tile%' limit 1)),
('Cayman Hardware Co-op', '30 sheets drywall + 5 gal primer at cost', 720, '2025-07-01', 'received', (select id from materials where item like '%Drywall%' limit 1)),
('Anonymous (via WhatsApp)', 'Demo day skip bin + lunch for volunteers (cash/IOU)', 850, '2025-07-03', 'pledged', null),
('Local Electrician (James)', 'Electrical rough-in labor (20 hrs) + some wire donation (in-kind-labor)', 1800, '2025-07-05', 'pledged', null);

-- Seed Volunteers (simplified)
insert into volunteers (name, skills, availability, waiver_signed) values
('Tina Harrison', array['project-mgmt', 'painting', 'demo'], 'Most weekdays + all demo weekend', true),
('Joel Harrison', array['demo', 'carpentry', 'project-mgmt'], 'Evenings + full demo days', true),
('Marcus Reid', array['tiling', 'demo'], 'Weekends + July 27', false),
('Aisha & Devon Clarke', array['painting', 'demo', 'cleanup'], 'July 26-28', true),
('Pastor Ken', array['demo', 'heavy lifting'], 'Demo day only', true);

-- Seed Budget Transactions (mapped from sample, using simplified type)
insert into budget_transactions (date, amount, type, notes) values
('2025-06-28', 3500, 'donation', 'North Side Church donation - cash received'),
('2025-07-05', -1250, 'expense', 'Roof inspection + report (paid)'),
('2025-07-01', 4200, 'donation', 'Thompson family — tile in-kind pledge'),
('2025-07-10', -680, 'expense', 'Skip bin deposit (demo day)'),
('2025-07-01', 720, 'in-kind', 'Drywall donation value (Cayman Hardware)'),
('2025-07-03', 1500, 'donation', 'Anonymous cash (WhatsApp)'),
('2025-07-05', 1800, 'donation', 'Local Electrician (James) - in-kind labor');

-- Note: For full app integration, link budget to donations/materials via additional columns or junction if needed.
-- This seed provides realistic starting data based on the 413 sqft tile, roof P0, July 27 demo, etc.

-- ============================================
-- IMPORT FUNCTIONS (as Postgres functions or comments for app layer)
-- For Excel/PDF summaries, implement in app code (lib/import-utils.ts)
-- Example usage: Call from client/server after parsing file.
-- ============================================

-- Example Postgres helper function for bulk import (optional, for direct SQL)
create or replace function import_materials_from_summary(
  materials_json jsonb
) returns void as $$
begin
  insert into materials (item, qty_needed, unit, cost, status, category, labor_notes)
  select 
    (m->>'item')::text,
    (m->>'qty_needed')::numeric,
    (m->>'unit')::text,
    (m->>'cost')::numeric,
    coalesce((m->>'status')::text, 'needed'),
    (m->>'category')::text,
    (m->>'labor_notes')::text
  from jsonb_array_elements(materials_json) as m
  on conflict (id) do nothing;  -- adjust if using natural keys
end;
$$ language plpgsql;

-- Similar for action_items, etc. (can expand).

-- End of migration. After running, set up Supabase env vars and client in Next.js.
-- Then use in app for realtime queries, auth for roles (core_team vs volunteer/donor).
