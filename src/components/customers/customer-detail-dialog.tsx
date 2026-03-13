"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { formatDisplayDate } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CustomerDetailDialogProps = {
  customer: {
    id: string;
    name: string;
    phone: string | null;
    vehicles: Array<{
      id: string;
      registration: string;
      make: string | null;
      model: string | null;
      year: number | null;
    }>;
    jobs: Array<{
      id: string;
      scheduledStart: Date;
      durationMins: number;
      status:
        | "BOOKED"
        | "ARRIVED"
        | "IN_PROGRESS"
        | "WAITING_PARTS"
        | "WAITING_COLLECTION"
        | "COMPLETED"
        | "CANCELLED";
      vehicle: {
        registration: string;
      };
      jobType: {
        name: string;
        color: string;
      };
    }>;
  } | null;
};

export function CustomerDetailDialog({
  customer,
}: CustomerDetailDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const closeDialog = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("customerId");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Dialog open={Boolean(customer)} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-2xl">
        {customer ? (
          <>
            <DialogHeader>
              <DialogTitle>{customer.name}</DialogTitle>
              <DialogDescription>
                {customer.phone || "No phone number saved"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Vehicles
                </h3>
                {customer.vehicles.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No vehicles recorded.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {customer.vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] px-4 py-3"
                      >
                        <p className="font-semibold text-[var(--foreground)]">
                          {vehicle.registration}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {[vehicle.make, vehicle.model, vehicle.year]
                            .filter(Boolean)
                            .join(" ") || "Vehicle details not yet captured"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Recent jobs
                </h3>
                {customer.jobs.length === 0 ? (
                  <p className="text-sm text-[var(--muted-foreground)]">
                    No jobs recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {customer.jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/jobs/${job.id}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--surface-border)] bg-white px-4 py-3 transition-colors hover:bg-[var(--surface-muted)]/30"
                      >
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">
                            {formatDisplayDate(job.scheduledStart)}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {job.vehicle.registration}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${job.jobType.color}18`,
                            color: job.jobType.color,
                          }}
                        >
                          {job.jobType.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-[var(--surface-border)] pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" disabled>
                  Edit customer
                </Button>
                <Button asChild>
                  <Link href="/diary">Create job</Link>
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
