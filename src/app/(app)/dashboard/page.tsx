import Link from "next/link";

import { NextAvailableSlots } from "@/components/dashboard/next-available-slots";
import { AppPage } from "@/components/layout/app-page";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireCurrentWorkshop } from "@/lib/workshop";
import { getWorkshopJobTypes } from "@/services/jobs";
import { getDashboardMetrics } from "@/services/dashboard";

export default async function DashboardPage() {
  const tenant = await requireCurrentWorkshop();
  const [metrics, jobTypes] = await Promise.all([
    getDashboardMetrics(tenant.workshopId),
    getWorkshopJobTypes(tenant.workshopId),
  ]);

  const dashboardStats = [
    {
      label: "Jobs today",
      value: metrics.jobsToday,
      icon: "today",
    },
    {
      label: "In progress",
      value: metrics.inProgress,
      icon: "build",
    },
    {
      label: "Waiting parts",
      value: metrics.waitingParts,
      icon: "package_2",
    },
    {
      label: "Waiting collection",
      value: metrics.waitingCollection,
      icon: "local_shipping",
    },
  ];
  const upcomingWorkloadRows = [
    {
      label: "Bookings next 7 days",
      value: metrics.upcomingWorkload.bookingsNext7Days.toString(),
    },
    {
      label: "MOT bookings next 7 days",
      value: metrics.upcomingWorkload.motBookingsNext7Days.toString(),
    },
    {
      label: "Service / repair next 7 days",
      value: metrics.upcomingWorkload.serviceRepairBookingsNext7Days.toString(),
    },
    {
      label: "Busiest upcoming day",
      value: metrics.upcomingWorkload.busiestUpcomingDay
        ? `${metrics.upcomingWorkload.busiestUpcomingDay.label} · ${metrics.upcomingWorkload.busiestUpcomingDay.bookings}`
        : "No busiest day yet",
    },
  ];

  return (
    <AppPage className="gap-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <Card
            key={item.label}
            className="overflow-hidden border-transparent bg-white shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface-muted)] shadow-inner shadow-white/70">
                <MaterialIcon
                  name={item.icon}
                  className="text-[26px] text-[var(--primary)]"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--muted-foreground)]">
                  {item.label}
                </p>
                <p className="mt-2 text-[2.6rem] font-semibold leading-none tracking-tight text-[var(--foreground)]">
                  {item.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="overflow-hidden border-transparent shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
          <div
            className="border-b border-[var(--surface-border)] px-6 py-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,118,110,0.16), rgba(15,118,110,0.05) 42%, rgba(255,255,255,0.95) 100%)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Operational highlight
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                  Next available slots
                </h2>
                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                  The next bookable times based on current bookings, slot length, and
                  workshop working hours.
                </p>
              </div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white/80 text-[var(--primary)] shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                <MaterialIcon name="event_available" className="text-[28px]" />
              </div>
            </div>
          </div>

          <CardContent className="pt-5">
            {metrics.nextAvailableSlots.length > 0 ? (
              <NextAvailableSlots
                slots={metrics.nextAvailableSlots.map((slot) => ({
                  startsAt: slot.startsAt.toISOString(),
                  endsAt: slot.endsAt.toISOString(),
                  dateParam: slot.dateParam,
                }))}
                slotLength={metrics.slotLength}
                jobTypes={jobTypes}
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)] px-6 py-10">
                <p className="text-lg font-semibold text-[var(--foreground)]">
                  No free slot found
                </p>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                  No unbooked slot was found in the next 14 working days. Open the diary
                  to review the current schedule or adjust workshop hours in Settings.
                </p>
                <div className="mt-5">
                  <Button variant="outline" asChild>
                    <Link href="/diary">Open diary</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-transparent shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">
              Planning snapshot
            </CardDescription>
            <CardTitle className="text-2xl">Upcoming workload</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {upcomingWorkloadRows.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--surface-border)] bg-white p-4"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-[var(--muted-foreground)] text-right">
                  {item.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppPage>
  );
}
