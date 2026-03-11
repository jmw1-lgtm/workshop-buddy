# Workshop Buddy — Architecture

## Tech Stack

Framework:
- Next.js (App Router)

Language:
- TypeScript

Styling:
- Tailwind CSS
- shadcn/ui

Authentication:
- Clerk

Database:
- Supabase PostgreSQL

ORM:
- Prisma

Billing:
- Stripe

Hosting:
- Vercel

---

## Multi-Tenant Architecture

Workshop Buddy is a **multi-tenant SaaS application**.

A single database is shared between all customers.

All application data must include a `workshopId`.

Example tables:

- workshops
- customers
- vehicles
- jobs
- job_types

Every query must be scoped by `workshopId`.

---

## Core Data Model

### Workshop

Represents a garage.

Fields may include:

- id
- name
- address
- phone
- email
- slotLength

---

### Customer

Fields:

- id
- workshopId
- name
- phone
- email

---

### Vehicle

Fields:

- id
- workshopId
- customerId
- registration
- make
- model
- fuel
- year
- engine

---

### Job

Central entity.

Fields:

- id
- workshopId
- customerId
- vehicleId
- jobTypeId
- status
- scheduledStart
- duration
- notes

---

### JobType

Fields:

- id
- workshopId
- name
- colour

---

## Folder Structure

Suggested structure:

app/
components/
lib/
db/
auth/
services/
prisma/
docs/


---

## Auth Model

Authentication is handled by Clerk.

Each user belongs to a workshop.

Future versions may support multiple users per workshop.

---

## Design System

UI decisions:

- dark sidebar
- light main UI
- rounded cards
- Raleway font
- Material Symbols icons
- slot-based diary