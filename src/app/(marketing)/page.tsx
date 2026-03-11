import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { SiteHeader } from "@/components/marketing/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const marketingCards = [
  {
    title: "Faster than the whiteboard",
    description:
      "A reception-first workspace built to book jobs, search customers, and manage the day without dealership complexity.",
    icon: "bolt",
  },
  {
    title: "Structured for multi-tenant SaaS",
    description:
      "Workshop data, memberships, and billing foundations are scoped cleanly so the app can grow without rework.",
    icon: "domain",
  },
  {
    title: "Ready for the operational MVP",
    description:
      "Dashboard, diary, customers, and settings are scaffolded behind authentication with reusable layout primitives.",
    icon: "inventory_2",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="default" className="bg-white text-[var(--foreground)]">
              Production-minded SaaS foundation
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl">
                The operations layer for independent workshops.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
                Workshop Buddy replaces the paper diary with a modern workflow shell designed for small garages, starting with a clean tenant-aware architecture.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">Start your trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Preview the app shell</Link>
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "Multi-tenant by default",
                "Clerk + Prisma + Stripe",
                "Reception-first app shell",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-medium text-[var(--foreground)] shadow-sm backdrop-blur"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden border-white/70 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
            <CardHeader className="border-b border-white/10 pb-5">
              <CardTitle className="text-white">Foundation preview</CardTitle>
              <CardDescription className="text-slate-300">
                The authenticated area is structured for dashboard, diary, customers, settings, onboarding, and billing to evolve without layout rework.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid gap-4">
                {[
                  ["Dashboard shell", "Operational headline cards and quick actions"],
                  ["Diary placeholder", "Protected route reserved for slot scheduling"],
                  ["Customer workspace", "Search and vehicle history structure"],
                ].map(([label, description]) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]">
                      <MaterialIcon name="check_circle" />
                    </span>
                    <div>
                      <p className="font-semibold">{label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {marketingCards.map((card) => (
            <Card key={card.title} className="bg-white/85 backdrop-blur">
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
                  <MaterialIcon name={card.icon} className="text-[var(--primary)]" />
                </div>
                <CardTitle className="mt-4">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
