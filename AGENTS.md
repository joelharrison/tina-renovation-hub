<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<<<<<<< HEAD

# The Hub — Project Rules (Hands On Cayman Renovation)

## Core Principles
- **Community-first + Safety-first UX**: Every screen must feel calm, clear, and empowering for core team, volunteers on-site, and donors. Prioritize P0 safety and dependencies. Use warm, modern, residential + island-appropriate aesthetics (soft neutrals, clean typography, generous whitespace, tasteful accent like warm terracotta/sage + ocean teal accents for Cayman).
- **Local-first, delightful, offline-capable**: Data must feel instant on phone at the dusty house. Start with localStorage + seed data. Add real persistence (SQLite or Supabase) only after core flows work.
- **Role-aware by default**: Core team = full power. Volunteers = sign-up + view + waivers. Donors = impact + pledge. Hide or disable edit controls cleanly.
- **Local-first, delightful**: Start with great offline/local experience. Data should feel instant. Add persistence and sync later.
- **Progressive enhancement**: Beautiful static + interactive dashboard first. Add forms, uploads, state only when needed.
- **Type safety everywhere**: Strict TypeScript. Define clear interfaces for Project, Room, BudgetItem, Photo, Vendor, Task, Milestone, etc.
- **Mobile excellence**: The hub will be used on phone during site visits. Prioritize responsive, touch-friendly, thumb-zone layouts.

## Styling & Components
- Use Tailwind v4 utility classes exclusively for styling.
- Prefer semantic HTML + ARIA. Keep components small and composable.
- Icons: lucide-react (install when first needed).
- No heavy UI kits in MVP unless explicitly decided. Add shadcn/ui later if we want polished form components.
- Dark mode: Support system preference but default to clean light residential feel. Use CSS variables for theming.

## Code Quality
- One feature / component per logical file when it grows.
- Prefer server components + client islands only where interactivity (forms, drag/drop, state) is required.
- Keep `app/page.tsx` as the main dashboard shell; extract cards/sections.
- Use descriptive variable names. Avoid magic numbers/strings.
- Add minimal but useful comments only for non-obvious business logic.

## Data & State (MVP)
- Use React useState + useEffect for now (or localStorage for persistence).
- Model core entities early:
  - Project / Phase
  - Room (kitchen, bath, etc.)
  - BudgetLine (category, planned, actual, vendor, notes)
  - Photo (roomId, date, caption, before/after flag, url or base64 for MVP)
  - Task / PunchItem
- Later: introduce a simple store (Zustand or Jotai) or move to DB.

## Integrations (when we get there)
- WhatsApp MCP: Send/receive progress updates, photo notifications.
- Notion MCP: Mirror key data or export summaries.
- GitHub: Only for code, not content.
- File uploads: Start with local (File API + object URLs), later persist to public/ or cloud.

## Git & Commits
- Conventional commits preferred.
- Keep PRs focused. One screen or feature slice at a time.
- Never commit node_modules, .env*, large binaries.

## When in Doubt
- Ask: "How would a volunteer on a ladder or a donor checking progress on their phone use this?"
- When adding features, always consider the three personas and the July 27 demolition deadline pressure.
- Default to clarity over cleverness.
- Make the happy path (seeing progress, adding a photo, logging spend) extremely fast.
=======
>>>>>>> 3c5e9d8 (Initial commit from Create Next App)
