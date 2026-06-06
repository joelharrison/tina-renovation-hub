import { createClient } from '@supabase/supabase-js';

// Supabase client setup for The Hub
// Get these from your Supabase project settings > API
// Create .env.local with:
// NEXT_PUBLIC_SUPABASE_URL=your-project-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
// SUPABASE_SERVICE_ROLE_KEY=your-service-role (server only, for admin imports)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Types matching the new Postgres schema (for typed queries)
export type MaterialRow = {
  id: string;
  item: string;
  qty_needed: number;
  unit: string | null;
  cost: number | null;
  status: string | null;
  category: string | null;
  labor_notes: string | null;
  created_at: string;
  updated_at?: string;
};

export type ActionItemRow = {
  id: string;
  title: string;
  description: string | null;
  owner: string | null;
  status: string | null;
  priority: string | null;  // P0-P4
  due_date: string | null;
  dependencies: string[] | null;
  created_at: string;
  updated_at?: string;
};

export type DonationRow = {
  id: string;
  donor: string;
  item: string | null;
  value: number | null;
  date: string | null;
  status: string | null;
  linked_material_id: string | null;
  created_at: string;
};

export type VolunteerRow = {
  id: string;
  name: string;
  skills: string[] | null;
  availability: string | null;
  waiver_signed: boolean | null;
  created_at: string;
  updated_at?: string;
};

export type BudgetTransactionRow = {
  id: string;
  date: string | null;
  amount: number;
  type: string | null;  // cash/donation/IOU/expense/in-kind
  notes: string | null;
  created_at: string;
};

// Helper: Check if Supabase is configured
export const isSupabaseEnabled = () => !!supabase;

// Example realtime subscription helper (for future use in components)
export function subscribeToTable<T>(
  table: string,
  callback: (payload: any) => void
) {
  if (!supabase) return null;
  return supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe();
}
