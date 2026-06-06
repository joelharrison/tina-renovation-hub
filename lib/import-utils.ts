import * as XLSX from 'xlsx';
import { supabase, isSupabaseEnabled, MaterialRow, ActionItemRow } from './supabase';
import { toast } from 'sonner';

// ============================================
// IMPORT FUNCTIONS FOR EXCEL / PDF SUMMARIES
// For the Hub - Hands On project
// These can feed into Supabase (if configured) or be adapted for local state.
// ============================================

// --- MATERIALS IMPORT (Excel) ---
// Expected columns in Excel/CSV: item, qty_needed, unit, cost, status, category, labor_notes
export async function importMaterialsFromExcel(file: File): Promise<MaterialRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const materials: MaterialRow[] = json.map((row, index) => ({
          id: `imported-${Date.now()}-${index}`,
          item: row.item || row.Item || row['Material/Item'] || 'Unknown Item',
          qty_needed: parseFloat(row.qty_needed || row['Qty Needed'] || row.qty || 0),
          unit: row.unit || row.Unit || 'each',
          cost: parseFloat(row.cost || row.Cost || row['Unit Cost'] || 0),
          status: (row.status || row.Status || 'needed').toLowerCase(),
          category: (row.category || row.Category || row['Category (tile/paint/etc)'] || 'other').toLowerCase(),
          labor_notes: row.labor_notes || row['Labor Notes'] || row.notes || null,
          created_at: new Date().toISOString(),
        }));

        if (isSupabaseEnabled() && supabase) {
          const { error } = await supabase.from('materials').insert(materials);
          if (error) throw error;
          toast.success(`Imported ${materials.length} materials to Supabase`);
        } else {
          toast.success(`Parsed ${materials.length} materials (local mode - no Supabase)`);
        }
        resolve(materials);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// --- ACTION ITEMS IMPORT (Excel or PDF text summary) ---
// For Excel: columns title, description, owner, status, priority, due_date, dependencies (comma sep)
// For PDF summaries: pass extracted text, simple line parser for "Title: ... Priority: P0 ..." etc.
export async function importActionItemsFromExcelOrSummary(
  input: File | string  // File for Excel, string for PDF-extracted text summary
): Promise<ActionItemRow[]> {
  let items: ActionItemRow[] = [];

  if (typeof input === 'string') {
    // PDF summary text parsing (simple heuristic parser for common formats)
    // Example input text:
    // "1. Complete roof inspection. P0. Due 2025-07-18. Owner: Joel. Dependencies: none."
    const lines = input.split('\n').filter(l => l.trim());
    items = lines.map((line, i) => {
      const titleMatch = line.match(/^\d+[\.\)]\s*(.+?)(?:\.|\sP[0-4]|$)/i);
      const priorityMatch = line.match(/P([0-4])/i);
      const dueMatch = line.match(/due[:\s]+(\d{4}-\d{2}-\d{2})/i);
      const ownerMatch = line.match(/owner[:\s]+([^\.]+)/i);
      const depMatch = line.match(/dependenc(?:y|ies)[:\s]+([^\.]+)/i);

      return {
        id: `pdf-${Date.now()}-${i}`,
        title: titleMatch ? titleMatch[1].trim() : line.trim().substring(0, 80),
        description: line.trim(),
        owner: ownerMatch ? ownerMatch[1].trim() : null,
        status: 'todo',
        priority: priorityMatch ? `P${priorityMatch[1]}` : 'P2',
        due_date: dueMatch ? dueMatch[1] : null,
        dependencies: depMatch ? depMatch[1].split(',').map((d: string) => d.trim()) : null,
        created_at: new Date().toISOString(),
      };
    });
    toast.info(`Parsed ${items.length} action items from PDF summary text`);
  } else {
    // Excel file
    const data = await new Promise<ArrayBuffer>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result as ArrayBuffer);
      r.onerror = rej;
      r.readAsArrayBuffer(input);
    });
    const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json: any[] = XLSX.utils.sheet_to_json(sheet);

    items = json.map((row, i) => ({
      id: `excel-${Date.now()}-${i}`,
      title: row.title || row.Title || row['Action Item'] || 'Untitled',
      description: row.description || row.Description || row.notes || null,
      owner: row.owner || row.Owner || row.assignee || null,
      status: (row.status || row.Status || 'todo').toLowerCase(),
      priority: (row.priority || row.Priority || 'P2').toUpperCase(),
      due_date: row.due_date || row['Due Date'] || null,
      dependencies: row.dependencies 
        ? (typeof row.dependencies === 'string' ? row.dependencies.split(',').map((d: string) => d.trim()) : row.dependencies)
        : null,
      created_at: new Date().toISOString(),
    }));
    toast.success(`Parsed ${items.length} action items from Excel`);
  }

  if (isSupabaseEnabled() && supabase) {
    const { error } = await supabase.from('action_items').insert(items);
    if (error) {
      console.error(error);
      toast.error('Failed to insert to Supabase, data parsed locally');
    } else {
      toast.success(`Imported ${items.length} action items to Supabase`);
    }
  }

  return items;
}

// --- Generic: Import Donations / Volunteers / Budget from Excel summary ---
// Extend as needed. Example for donations.
export async function importDonationsFromExcel(file: File): Promise<any[]> {
  // Similar to above using XLSX...
  const data = await new Promise<ArrayBuffer>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as ArrayBuffer);
    r.onerror = rej;
    r.readAsArrayBuffer(file);
  });
  const wb = XLSX.read(new Uint8Array(data), { type: 'array' });
  const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  const donations = json.map((row: any, i: number) => ({
    id: `don-${Date.now()}-${i}`,
    donor: row.donor || row.Donor || 'Unknown Donor',
    item: row.item || row.Item || row.description,
    value: parseFloat(row.value || row.Value || row.amount || 0),
    date: row.date || row.Date || new Date().toISOString().slice(0,10),
    status: (row.status || row.Status || 'pledged').toLowerCase(),
    linked_material_id: null, // resolve by name in real use
  }));

  if (isSupabaseEnabled() && supabase) {
    await supabase.from('donations').insert(donations);
  }
  toast.success(`Imported ${donations.length} donations`);
  return donations;
}

// Usage example in a component (e.g. in Documents or Reports page):
// <input type="file" onChange={e => importMaterialsFromExcel(e.target.files![0])} />
// For PDF: extract text first (use pdf.js or external OCR), then importActionItemsFromExcelOrSummary(text)

// Future: Add Supabase storage upload for the original Excel/PDF files in documents table.
