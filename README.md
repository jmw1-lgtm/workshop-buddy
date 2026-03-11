# Workshop Buddy

Production-minded SaaS foundation for independent vehicle workshops.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component setup
- Clerk authentication
- Prisma ORM
- Supabase PostgreSQL
- Stripe billing scaffolding

## Setup

1. Copy `.env.example` to `.env.local`.
2. Add Clerk, Supabase Postgres, and Stripe credentials.
3. Run `npm install`.
4. Generate Prisma client with `npm run db:generate`.
5. Start the app with `npm run dev`.

## Current scope

- Public marketing homepage
- Protected authenticated app shell
- Placeholder dashboard, diary, customers, and settings routes
- Multi-tenant data model foundation with `workshopId` on application records
- Stripe webhook endpoint scaffold

## Next implementation step

Persist workshop membership and onboarding so Clerk users can be linked to a real `Workshop` before feature data is added.
