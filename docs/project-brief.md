# Workshop Buddy — Product Brief

## Overview

Workshop Buddy is a lightweight SaaS platform designed for **small independent vehicle workshops and garages**.

The product replaces paper-based workshop diaries and provides a simple operational system to manage daily jobs, customers, and vehicles.

Workshop Buddy is intentionally **not a dealership management system (DMS)**. It is designed for small independent garages with simple workflows.

Typical customer:

- independent garage
- MOT / repair / service workshop
- 1–10 staff
- reception desk computer or tablet
- currently using a paper diary or whiteboard

---

## Product Vision

Workshop Buddy aims to become the **operating system for small garages**.

The workflow is centred around a **Job**.


The diary visually displays jobs scheduled throughout the day.

---

## MVP Goals

The MVP should allow a workshop to:

1. sign up for a trial
2. complete onboarding
3. open the workshop diary
4. create jobs quickly
5. search customers and vehicles
6. update job statuses
7. print job cards

The system must feel **faster and easier than a paper diary**.

---

## Core Features (MVP)

### SaaS Foundation

- marketing site
- user sign-up
- authentication
- Stripe subscription
- workshop onboarding
- multi-tenant architecture

---

### Dashboard

Operational overview including:

- jobs today
- jobs in progress
- waiting parts
- waiting collection
- next available 1-hour slot

---

### Diary

The diary is the central screen.

Features:

- day view
- slot-based scheduling
- drag and move jobs
- create/edit/delete jobs
- open job card from diary

Slots are configured during onboarding.

Possible values:

- 30 minutes
- 60 minutes

Jobs span multiple slots depending on duration.

---

### Job Card

Each scheduled job opens a job card containing:

- customer
- vehicle
- job type
- notes
- status

The job card should also support **printing**.

Printed job cards allow technicians to work from paper if needed.

---

### Job Status

Default statuses:

- Booked
- Arrived
- In Progress
- Waiting Parts
- Waiting Collection
- Completed
- Cancelled

---

### Customers

Customers page should allow:

- searching customers
- viewing vehicles
- viewing job history

Search should support:

- name
- phone
- registration

---

### Vehicles

Vehicles belong to customers.

Vehicle data includes:

- registration
- make
- model
- fuel
- engine
- year

---

### DVLA Lookup

Entering a vehicle registration should attempt a DVLA lookup.

If successful, the system auto-fills vehicle details.

---

### Job Types

Default job types:

- Service
- MOT
- Repair
- Diagnostics
- Other

Each job type should support a **colour** used in the diary.

---

## Product Principles

Workshop Buddy should follow these principles:

### Speed

Common actions should be extremely fast.

Creating a job should take **under 10 seconds**.

---

### Simplicity

Avoid dealership-level complexity.

The system should feel intuitive for non-technical users.

---

### Practicality

Every screen must help the workshop run its day.

---

### Modern UI

The product should look like modern SaaS software but remain simple.

---

## Post-MVP Features

Future features may include:

- week diary view
- technician assignment
- bays/ramps
- reminders
- invoicing integrations
- parts lookup
- online booking
- reporting
- mobile enhancements