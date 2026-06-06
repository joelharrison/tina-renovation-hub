import { z } from "zod";

// Enums
export const PrioritySchema = z.enum(["P0", "P1", "P2", "P3", "P4"]);
export type Priority = z.infer<typeof PrioritySchema>;

export const ActionStatusSchema = z.enum([
  "backlog",
  "todo",
  "in_progress",
  "blocked",
  "done",
]);
export type ActionStatus = z.infer<typeof ActionStatusSchema>;

export const MaterialStatusSchema = z.enum([
  "needed",
  "sourcing",
  "ordered",
  "received",
  "installed",
  "donated-in-full",
]);
export type MaterialStatus = z.infer<typeof MaterialStatusSchema>;

export const DonationTypeSchema = z.enum([
  "cash",
  "in-kind-material",
  "in-kind-labor",
  "service",
  "tool-loan",
]);
export type DonationType = z.infer<typeof DonationTypeSchema>;

export const DonationStatusSchema = z.enum([
  "pledged",
  "received",
  "confirmed",
  "thank-you-sent",
]);
export type DonationStatus = z.infer<typeof DonationStatusSchema>;

export const RoleSchema = z.enum(["core_team", "volunteer", "donor"]);
export type Role = z.infer<typeof RoleSchema>;

export const DocumentCategorySchema = z.enum([
  "Roof Inspection",
  "Permit",
  "Quote/Estimate",
  "Contract",
  "Progress Photo",
  "Waiver",
  "Invoice",
  "Safety Report",
  "Other",
]);
export type DocumentCategory = z.infer<typeof DocumentCategorySchema>;

// Core Entities
export const ActionItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string().optional(),
  priority: PrioritySchema,
  status: ActionStatusSchema,
  area: z.string(),
  assignee: z.string().optional(),
  due_date: z.string().optional(), // ISO date string YYYY-MM-DD
  estimated_hours: z.number().optional(),
  blocks: z.array(z.string()).optional(),
  depends_on: z.array(z.string()).optional(),
  notes: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ActionItem = z.infer<typeof ActionItemSchema>;

export const MaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  quantity_needed: z.number(),
  unit: z.string(),
  quantity_ordered: z.number().default(0),
  quantity_received: z.number().default(0),
  quantity_installed: z.number().default(0),
  unit_cost: z.number(),
  supplier: z.string().optional(),
  status: MaterialStatusSchema,
  priority: PrioritySchema,
  notes: z.string().optional(),
  linked_donation_ids: z.array(z.string()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Material = z.infer<typeof MaterialSchema>;

export const DonationSchema = z.object({
  id: z.string(),
  donor_name: z.string(),
  donor_email: z.string().optional(),
  donor_phone: z.string().optional(),
  type: DonationTypeSchema,
  description: z.string(),
  estimated_value: z.number(),
  material_id: z.string().optional(),
  status: DonationStatusSchema,
  received_date: z.string().optional(),
  notes: z.string().optional(),
  created_at: z.string(),
});
export type Donation = z.infer<typeof DonationSchema>;

export const VolunteerSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  skills: z.array(z.string()),
  availability: z.string().optional(),
  preferred_areas: z.array(z.string()).optional(),
  waiver_signed: z.boolean().default(false),
  waiver_signed_at: z.string().optional(),
  waiver_document_url: z.string().optional(), // data URL or storage path
  hours_contributed: z.number().default(0),
  notes: z.string().optional(),
  created_at: z.string(),
});
export type Volunteer = z.infer<typeof VolunteerSchema>;

export const BudgetEntrySchema = z.object({
  id: z.string(),
  type: z.enum(["income", "expense", "pledge", "in-kind", "iou-out", "iou-in"]),
  amount: z.number(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
  linked_donation_id: z.string().optional(),
  linked_material_id: z.string().optional(),
  receipt_url: z.string().optional(),
  created_by: z.string().optional(),
  created_at: z.string(),
});
export type BudgetEntry = z.infer<typeof BudgetEntrySchema>;

export const DocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: DocumentCategorySchema,
  file_url: z.string(), // data URL for MVP or real path
  mime_type: z.string(),
  size_bytes: z.number().optional(),
  related_to: z.string().optional(), // 'roof' | action id | material id
  uploaded_by: z.string().optional(),
  uploaded_at: z.string(),
  description: z.string().optional(),
});
export type Document = z.infer<typeof DocumentSchema>;

// App state container (for local-first)
export const HubDataSchema = z.object({
  action_items: z.array(ActionItemSchema),
  materials: z.array(MaterialSchema),
  donations: z.array(DonationSchema),
  volunteers: z.array(VolunteerSchema),
  budget_entries: z.array(BudgetEntrySchema),
  documents: z.array(DocumentSchema),
  last_updated: z.string(),
});
export type HubData = z.infer<typeof HubDataSchema>;

export const DEFAULT_ROLE: Role = "core_team";
