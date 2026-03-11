# Workshop Buddy — Codex Instructions

Follow docs/project-brief.md as the source of truth for the product.

Rules:
- Build production-minded foundations, not a throwaway prototype.
- Keep MVP scope disciplined.
- Prefer clean, scalable patterns over hacks.
- Do not invent major product features beyond the agreed brief.
- Optimise for speed of receptionist workflows.
- Keep UI aligned with the agreed design language:
  - dark left sidebar
  - light top bar
  - rounded cards
  - Raleway font
  - Google Material Symbols Rounded
  - colour palette from the project brief
- Multi-tenant architecture is required.
- Scope all application data by workshopId.
- Use Clerk for auth, Supabase Postgres + Prisma for data, Stripe for billing.
- Explain file changes clearly after each task.
