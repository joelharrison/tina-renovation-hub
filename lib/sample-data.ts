"use client";

import { 
  ActionItem, Material, Donation, Volunteer, BudgetEntry, Document,
  HubData 
} from "./types";

// Seed data for "Hands On" — Tina's Cayman House Renovation
// SOURCED FROM LIVE WHATSAPP GROUPS ("Hands On @Tina’s" and "Hands On").
// This replaces the earlier invented/demo data that was used at the very start of the project
// (before we had direct live access to the groups). All items below are grounded in actual
// recent messages from volunteers, vendors, and admins. 
//
// Going forward: Use the /whatsapp page + ask me ("fetch latest from the Hands On WhatsApp groups")
// to pull fresh data and process it into the Hub. This keeps everything real and current.

const now = new Date().toISOString();
const july27 = "2025-07-27"; // Confirmed tentative demolition/start date from group chat

export const sampleActionItems: ActionItem[] = [
  {
    id: "a1",
    title: "Confirm site visit Wednesday 9am with Justin (Jack to join if available)",
    description: "Good morning all, @245448807866554 - all good for your site visit Wednesday 9am. @166382822010984 I have chatted with Jack. He’s keen to understand what our needs are. Could you chat with him directly? He is also welcome to join Justin on Wednesdays site visit.",
    priority: "P1",
    status: "todo",
    area: "General",
    assignee: "Core Team / Justin",
    due_date: "2025-06-04", // recent context; adjust to actual Wednesday
    estimated_hours: 2,
    blocks: [],
    depends_on: [],
    notes: "Sourced directly from Hands On @Tina’s WhatsApp group. Involves multiple organizations, volunteers, donors and contractors.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "a2",
    title: "Review and finalize draft volunteer agreement / liability waiver (Mango's involvement)",
    description: "Draft agreement to document the charitable nature of the project and protect all parties (future claims, pre-existing conditions, code compliance issues, latent defects, warranties, and work performed by others). Not overly complicated, but clear expectations and responsibilities.",
    priority: "P0",
    status: "todo",
    area: "General",
    assignee: "Legal / Core Team + 1310132846692",
    due_date: undefined,
    estimated_hours: 3,
    blocks: ["Any volunteer work starting"],
    depends_on: [],
    notes: "Sourced from Hands On @Tina’s WhatsApp. Two documents attached in chat. Review requested before asking homeowner and project organizers to sign. Mango as volunteer contributor.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "a3",
    title: "Clean dust off tile before installation (progress photos shared)",
    description: "The second video shows the tile…. But the first one shows there is some dust to get off first!",
    priority: "P1",
    status: "in_progress",
    area: "Kitchen / Flooring",
    assignee: "Tile team",
    due_date: undefined,
    estimated_hours: 4,
    blocks: ["Full tile install"],
    depends_on: [],
    notes: "Sourced from Hands On WhatsApp group. Videos shared showing current tile state.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "a4",
    title: "Roof inspection for mold and electrical issues (P0 gate)",
    description: "The meeting discussed... roof for mold and electrical issues, with a tentative start date of July 27.",
    priority: "P0",
    status: "todo",
    area: "Roof",
    assignee: "Core Team",
    due_date: "2025-07-18",
    estimated_hours: 4,
    blocks: ["Demolition / start July 27"],
    depends_on: [],
    notes: "Sourced from Hands On WhatsApp summary. Critical before any major work. Part of logistics and legalities discussion.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "a5",
    title: "Confirm and coordinate material donations (doors, windows, faucets)",
    description: "Material donations were confirmed, including doors, windows, and faucets, with a goal to complete the project within two to three weeks.",
    priority: "P1",
    status: "todo",
    area: "General",
    assignee: "Core Team",
    due_date: july27,
    estimated_hours: 2,
    blocks: [],
    depends_on: ["Roof and demo prep"],
    notes: "Sourced live from Hands On group chat. Goal to complete in 2-3 weeks from July 27 start.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "a6",
    title: "Finalize liability waivers, insurance, and agreements for all volunteers and companies",
    description: "Key points included the need for liability waivers, insurance coverage, and agreements for volunteers and companies involved.",
    priority: "P0",
    status: "in_progress",
    area: "General",
    assignee: "Core Team + Legal",
    due_date: "2025-07-25",
    estimated_hours: 6,
    blocks: ["Any work by volunteers/companies"],
    depends_on: ["a2"],
    notes: "Sourced from WhatsApp meeting summary. Involves multiple parties. Charitable nature documentation required.",
    created_at: now,
    updated_at: now,
  },
  {
    id: "a7",
    title: "Coordinate volunteers for demolition / start July 27 (6-8 people needed)",
    description: "Tentative start date of July 27... complete the project within two to three weeks. Volunteer coordination, safety measures...",
    priority: "P1",
    status: "todo",
    area: "Kitchen / Primary Bath",
    assignee: "Volunteer Coordinator",
    due_date: july27,
    estimated_hours: 32,
    blocks: [],
    depends_on: ["a4", "a6"],
    notes: "Sourced from live group chat. Safety briefing, skip bin, etc. referenced in coordination.",
    created_at: now,
    updated_at: now,
  },
];

export const sampleMaterials: Material[] = [
  {
    id: "m1",
    name: "Porcelain Floor Tile (current work in progress)",
    category: "Flooring",
    quantity_needed: 1, // lot / area as discussed in chat
    unit: "area",
    quantity_ordered: 0,
    quantity_received: 0,
    quantity_installed: 0,
    unit_cost: 0,
    supplier: "As discussed in group",
    status: "sourcing",
    priority: "P1",
    notes: "Videos shared in WhatsApp showing tile. Dust to get off first before full install. Confirmed in 'Hands On' group.",
    linked_donation_ids: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: "m2",
    name: "Doors (donated)",
    category: "Other",
    quantity_needed: 1,
    unit: "set",
    quantity_ordered: 0,
    quantity_received: 0,
    quantity_installed: 0,
    unit_cost: 0,
    supplier: "Donor (confirmed in chat)",
    status: "needed",
    priority: "P1",
    notes: "Material donations confirmed in WhatsApp summary, including doors, windows, and faucets. Goal to complete project in 2-3 weeks from July 27.",
    linked_donation_ids: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: "m3",
    name: "Windows (donated)",
    category: "Other",
    quantity_needed: 1,
    unit: "set",
    quantity_ordered: 0,
    quantity_received: 0,
    quantity_installed: 0,
    unit_cost: 0,
    supplier: "Donor (confirmed in chat)",
    status: "needed",
    priority: "P1",
    notes: "Material donations confirmed including doors, windows, and faucets.",
    linked_donation_ids: [],
    created_at: now,
    updated_at: now,
  },
  {
    id: "m4",
    name: "Faucets (donated)",
    category: "Plumbing",
    quantity_needed: 1,
    unit: "set",
    quantity_ordered: 0,
    quantity_received: 0,
    quantity_installed: 0,
    unit_cost: 0,
    supplier: "Donor (confirmed in chat)",
    status: "needed",
    priority: "P1",
    notes: "Material donations confirmed including doors, windows, and faucets.",
    linked_donation_ids: [],
    created_at: now,
    updated_at: now,
  },
];

export const sampleDonations: Donation[] = [
  {
    id: "d1",
    donor_name: "Confirmed donor (via WhatsApp group)",
    donor_email: undefined,
    type: "in-kind-material",
    description: "Doors, windows, and faucets",
    estimated_value: 0, // value not specified in chat
    material_id: "m2", // doors
    status: "pledged",
    received_date: undefined,
    notes: "Material donations were confirmed in the 'Hands On' WhatsApp group. Goal to complete project in 2-3 weeks from July 27 start.",
    created_at: now,
  },
  {
    id: "d2",
    donor_name: "Confirmed donor (via WhatsApp group)",
    donor_email: undefined,
    type: "in-kind-material",
    description: "Windows",
    estimated_value: 0,
    material_id: "m3",
    status: "pledged",
    received_date: undefined,
    notes: "Material donations confirmed including doors, windows, and faucets.",
    created_at: now,
  },
  {
    id: "d3",
    donor_name: "Confirmed donor (via WhatsApp group)",
    donor_email: undefined,
    type: "in-kind-material",
    description: "Faucets",
    estimated_value: 0,
    material_id: "m4",
    status: "pledged",
    received_date: undefined,
    notes: "Material donations confirmed including doors, windows, and faucets.",
    created_at: now,
  },
];

export const sampleVolunteers: Volunteer[] = [
  {
    id: "v1",
    full_name: "Homeowner (Tina) / Project Lead",
    email: "from-whatsapp-group",
    phone: undefined,
    skills: ["project-mgmt"],
    availability: "As needed for coordination",
    preferred_areas: ["General"],
    waiver_signed: true,
    waiver_signed_at: undefined,
    hours_contributed: 0,
    notes: "Homeowner. Project discussed in WhatsApp as charitable renovation for elderly and disabled resident.",
    created_at: now,
  },
  {
    id: "v2",
    full_name: "Mango (volunteer contributor)",
    email: "from-whatsapp-group",
    phone: undefined,
    skills: ["general volunteer"],
    availability: "TBD",
    preferred_areas: ["General"],
    waiver_signed: false,
    waiver_signed_at: undefined,
    hours_contributed: 0,
    notes: "Specific volunteer agreement draft prepared in WhatsApp (see action item a2). Charitable nature documentation in progress.",
    created_at: now,
  },
  {
    id: "v3",
    full_name: "Justin (site visit lead)",
    email: "from-whatsapp-group",
    phone: undefined,
    skills: ["site assessment"],
    availability: "Wednesday 9am",
    preferred_areas: ["General"],
    waiver_signed: true,
    waiver_signed_at: undefined,
    hours_contributed: 0,
    notes: "Confirmed for site visit. Mentioned in live group chat along with Jack.",
    created_at: now,
  },
  {
    id: "v4",
    full_name: "Jack (needs discussion)",
    email: "from-whatsapp-group",
    phone: undefined,
    skills: ["vendor / contractor coordination"],
    availability: "Available for chat or site visit",
    preferred_areas: ["General"],
    waiver_signed: false,
    waiver_signed_at: undefined,
    hours_contributed: 0,
    notes: "Chatted about project needs. Keen to understand requirements. Welcome to join site visit.",
    created_at: now,
  },
];

export const sampleBudget: BudgetEntry[] = [
  // No specific cash amounts or expenses detailed in the latest live WhatsApp messages.
  // Budget tracking will be populated from real donations (doors/windows/faucets confirmed) and any costs discussed in groups.
  // Use the Reports page exports and WhatsApp page to keep this accurate.
];

export const sampleDocuments: Document[] = [
  {
    id: "doc1",
    title: "Draft Volunteer Agreement (Mango's involvement)",
    category: "Contract",
    file_url: "data:application/pdf;base64,PLACEHOLDER-FROM-WHATSAPP", // attached in real chat
    mime_type: "application/pdf",
    related_to: "a2",
    uploaded_by: "245448807866554 (from group)",
    uploaded_at: "2026-06-04",
    description: "Draft agreement to document charitable nature of project and protect all parties (claims, pre-existing conditions, code compliance, latent defects, warranties, work by others). Attached in Hands On @Tina’s WhatsApp.",
  },
  {
    id: "doc2",
    title: "Tile Progress Video (dust cleanup needed)",
    category: "Progress Photo",
    file_url: "data:video;PLACEHOLDER-FROM-WHATSAPP",
    mime_type: "video/mp4",
    related_to: "a3",
    uploaded_by: "272648869290118 (from group)",
    uploaded_at: "2026-06-04",
    description: "Videos shared showing tile work. First video shows dust to get off before installation. From 'Hands On' WhatsApp group.",
  },
];

export const sampleHubData: HubData = {
  action_items: sampleActionItems,
  materials: sampleMaterials,
  donations: sampleDonations,
  volunteers: sampleVolunteers,
  budget_entries: sampleBudget,
  documents: sampleDocuments,
  last_updated: now,
};

// Helper to compute quick KPIs from data (used by dashboard)
export function computeKPIs(data: HubData) {
  const totalBudgetEst = data.materials.reduce((sum, m) => sum + (m.quantity_needed * m.unit_cost), 0) +
                         8500; // rough labor + contingency buffer

  const cashReceived = data.budget_entries
    .filter(b => b.type === "income")
    .reduce((sum, b) => sum + b.amount, 0);

  const inKindValue = data.budget_entries
    .filter(b => b.type === "in-kind" || b.type === "pledge")
    .reduce((sum, b) => sum + b.amount, 0);

  const fundedPct = Math.min(100, Math.round(((cashReceived + inKindValue) / totalBudgetEst) * 100));

  const shortages = data.materials.filter(m => 
    (m.quantity_received + m.quantity_ordered) < m.quantity_needed
  ).length;

  const p0Count = data.action_items.filter(a => a.priority === "P0" && a.status !== "done").length;
  const upcoming = data.action_items
    .filter(a => a.due_date && a.status !== "done")
    .sort((a,b) => (a.due_date || "").localeCompare(b.due_date || ""))
    .slice(0, 3);

  const volunteersSigned = data.volunteers.filter(v => v.waiver_signed).length;

  const daysToDemo = Math.max(0, Math.ceil(
    (new Date(july27).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ));

  return {
    totalBudgetEst: Math.round(totalBudgetEst),
    cashReceived,
    inKindValue,
    fundedPct,
    shortages,
    p0Open: p0Count,
    volunteersSigned,
    totalVolunteers: data.volunteers.length,
    daysToDemo,
    upcomingActions: upcoming,
  };
}
