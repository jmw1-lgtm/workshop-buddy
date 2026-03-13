import Link from "next/link";

import { formatDisplayDate } from "@/lib/dates";
import { jobStatusLabels } from "@/lib/job-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type CustomerDetailProps = {
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

export function CustomerDetail({ customer }: CustomerDetailProps) {
  if (!customer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No customer selected</CardTitle>
          <CardDescription>
            Select a customer from the list to view vehicles and recent jobs.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{customer.name}</CardTitle>
          <CardDescription>{customer.phone || "No phone number saved"}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
          <CardDescription>Vehicles linked to this customer in the current workshop.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {customer.vehicles.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No vehicles recorded.</p>
          ) : (
            customer.vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] px-4 py-3"
              >
                <p className="font-semibold text-[var(--foreground)]">{vehicle.registration}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {[vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(" ") || "Vehicle details not yet captured"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent jobs</CardTitle>
          <CardDescription>Latest jobs for this customer in the current workshop.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {customer.jobs.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No jobs recorded yet.</p>
          ) : (
            customer.jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-2xl border border-[var(--surface-border)] bg-white px-4 py-4 transition-colors hover:bg-[var(--surface-muted)]/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">
                      {job.vehicle.registration}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {formatDisplayDate(job.scheduledStart)} • {job.durationMins} minutes
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
                </div>
                <div className="mt-3">
                  <Badge variant="default">{jobStatusLabels[job.status]}</Badge>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
