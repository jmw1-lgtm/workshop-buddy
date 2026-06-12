# Workshop Buddy — Project Context

> This document is the primary reference for Claude/Codex sessions working in this repository.
> Keep it up to date as the product evolves. Do not create a duplicate — update this file.

---

## What is Workshop Buddy?

Workshop Buddy is a lightweight SaaS platform for small independent vehicle workshops and garages.

It replaces paper-based workshop diaries and provides a simple operational system to manage daily jobs, customers, and vehicles. It is intentionally **not** a dealership management system (DMS). The goal is to feel faster and easier than a paper diary.

---

## Target Users

- Independent garage owners and workshop managers
- Service advisors and technicians
- Small garages with 1–10 staff
- Currently using paper diaries, whiteboards, or basic spreadsheets
- Not technical — expect intuitive, fast software with minimal configuration

---

## Product Vision

Workshop Buddy aims to become the operating system for small independent garages.

The workflow centres on a **Job**. The diary visually displays jobs scheduled throughout the day. Everything else (customers, vehicles, job cards, status tracking) supports that core workflow.

---

## Core Product Areas

| Area | Description |
|---|---|
| Workshop Diary | Day-view slot-based scheduling grid |
| Job Cards | Per-job record with customer, vehicle, notes, status, line items |
| Customer Records | Search and manage customers |
| Vehicle Records | Vehicles linked to customers with DVLA lookup |
| Job Types | Colour-coded categories (Service, MOT, Repair, etc.) |
| Job Status Tracking | Booked → Arrived → In Progress → Completed etc. |
| Onboarding | Workshop setup after sign-up |
| Billing | Stripe subscription (trial → active) |
| Admin | Internal tools for managing workshops and users |

---

## Actual Tech Stack (as detected from repo)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS v4, shadcn/ui (Radix UI), Material Symbols |
| Authentication | Clerk (`@clerk/nextjs`) |
| Database | PostgreSQL via Supabase (free tier) |
| ORM | Prisma v6 |
| Billing | Stripe |
| External APIs | DVLA vehicle lookup |
| Hosting | Vercel (inferred from `@vercel/analytics`, `@vercel/speed-insights`) |
| Analytics | Vercel Analytics + Speed Insights |

> The project instructions mention .NET 9 / Blazor — this repo is **Next.js / TypeScript**, not .NET. The instructions were written before the actual stack was confirmed.

---

## Repository Structure

```
src/
  app/
    (app)/          # Authenticated app routes (diary, jobs, customers, etc.)
    (marketing)/    # Public marketing pages
    admin/          # Internal admin
    api/            # API routes (health, DVLA, diary, jobs, stripe webhooks)
    billing/        # Billing page and actions
    onboarding/     # Post-sign-up workshop setup
    sign-in/        # Clerk sign-in page
    sign-up/        # Clerk sign-up page
  auth/             # Tenant context helpers
  components/       # React components by feature
  db/               # Prisma client singleton
  lib/              # Utility functions, config, navigation
  services/         # Business logic (jobs, customers, workshops, stripe, etc.)
prisma/
  schema.prisma     # PostgreSQL schema via Prisma
docs/               # Project documentation (this folder)
```

---

## Sign-Up and Auth Flow

1. User visits `/sign-up` — handled entirely by Clerk (`<SignUp />` component)
2. After Clerk auth, user is redirected to `/onboarding`
3. Onboarding calls `createWorkshopWithOwner()` — first real database write
4. On success, user is redirected to `/dashboard`

**Critical risk**: if the Supabase database is paused (free tier inactivity), step 3 fails silently. The user sees a generic error and the owner has no visibility.

### Current Health Endpoint

`GET /api/health` exists but only returns `{ ok: true, service: "workshop-buddy" }`. It does **not** query the database. It will return `ok: true` even if Supabase is paused.

---

## Relationship to Mission Control

Mission Control is the operational source of truth for planning, task tracking, and project oversight.

- Read task context from Mission Control before implementation
- Update task status/notes in Mission Control after work is completed
- Treat Mission Control epics/tasks as the source of truth for active development
- Board slug: `workshop-buddy`
- Product areas: `Workshop Buddy App` (key: APP), `Marketing Site` (key: SITE)

---

## Preferred Development Workflow

Before making code changes:

1. Confirm the local repo is the correct Workshop Buddy repository
2. Check the current Git branch
3. Check the Git remote URL
4. Check for uncommitted changes
5. Check whether local is ahead/behind/synced/diverged from GitHub
6. Do not make changes until repo state is understood
7. Prefer a dedicated branch for implementation work
8. Keep changes small and reviewable
9. Avoid unrelated refactors
10. Update Mission Control task status/notes when a task progresses

---

## Current Priority: Sign-Up Reliability and Supabase Keep-Alive

Workshop Buddy's Supabase project is on the **free tier**, which pauses after periods of inactivity. This means:

- New users may be unable to complete onboarding (step 3 fails)
- The owner has no visibility when this happens
- The current health endpoint does not detect this

### Planned solution (without moving to paid tier immediately)

1. Fix the health endpoint to actually query the database
2. Add a daily heartbeat/keep-alive (Vercel Cron or similar) that calls the health endpoint
3. Surface health status in Mission Control
4. Document when a paid Supabase tier becomes necessary

---

## Near-Term Roadmap

**Immediate:**
- Audit sign-up and Supabase/database behaviour
- Fix health endpoint to check database connectivity
- Add daily scheduled heartbeat
- Add Mission Control health visibility
- Test sign-up and monitoring end-to-end

**Next:**
- Improve sign-up/onboarding UX
- Better operational error handling
- Resume product development board work
- Outreach tracking and prospect follow-up

**Later:**
- Subscription/trial management improvements
- Workshop reporting
- Business growth metrics
- Customer communication features
- Deeper automation integrations

---

## Coding Principles

- Simplicity first — avoid over-engineering
- Reliability before advanced features
- Small, focused changes — one thing at a time
- Practical workshop workflows over abstract systems
- Fast data entry and clear job status
- Minimal configuration burden on users
- Maintainable, readable code
- Low infrastructure cost until real usage justifies upgrading

---

## Things NOT to Do Without Explicit Approval

- Replace the app framework
- Change authentication strategy (Clerk)
- Move database provider
- Rewrite large areas of the UI
- Introduce a new paid service
- Add complex role/permission systems
- Add large monitoring infrastructure
- Change production environment variables
- Force-push or rewrite Git history
- Delete data
- Run destructive database migrations
- Commit secrets
- Make broad refactors unrelated to the current task
- Commit, push, pull, reset, or rebase without explaining the action first

---

## Environment Variables (keys only — never expose values)

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (public) |
| `CLERK_SECRET_KEY` | Clerk auth (secret) |
| `DATABASE_URL` | Supabase PostgreSQL connection (pooled) |
| `DIRECT_URL` | Supabase PostgreSQL direct connection (for migrations) |
| `STRIPE_SECRET_KEY` | Stripe billing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification |
| `STRIPE_MONTHLY_PRICE_ID` / `STRIPE_YEARLY_PRICE_ID` | Stripe product pricing |
| `DVLA_API_KEY` | DVLA vehicle lookup |
| `NEXT_PUBLIC_APP_URL` | App base URL |
| `ADMIN_EMAIL_ALLOWLIST` | Admin access control |
