import { notFound } from "next/navigation";

import { JobCardEditor } from "@/components/jobs/job-card-editor";
import { AppPage } from "@/components/layout/app-page";
import { MaterialIcon } from "@/components/layout/material-icon";
import { PrintJobCardButton } from "@/components/jobs/print-job-card-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDateTime } from "@/lib/dates";
import { jobStatusLabels } from "@/lib/job-status";
import { requireCurrentWorkshop } from "@/lib/workshop";
import { getJobCardData, getWorkshopJobTypes } from "@/services/jobs";

type JobCardPageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function JobCardPage({ params }: JobCardPageProps) {
  const tenant = await requireCurrentWorkshop();
  const { jobId } = await params;

  if (!jobId) {
    notFound();
  }

  const job = await getJobCardData({
    workshopId: tenant.workshopId,
    jobId,
  });
  const jobTypes = await getWorkshopJobTypes(tenant.workshopId);

  return (
    <AppPage className="print:block print:w-full print:max-w-none print:gap-0">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Job Card
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {job.vehicle.registration}
          </h2>
        </div>
        <PrintJobCardButton />
      </div>

      <Card className="overflow-hidden print:rounded-none print:border-0 print:shadow-none">
        <CardHeader className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)]/45 print:bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{job.workshop.name}</CardTitle>
              <CardDescription className="mt-2">
                Job card for workshop use. Not an invoice.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">{job.jobType.name}</Badge>
              <Badge variant="default">{jobStatusLabels[job.status]}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 px-6 py-6 print:px-0">
          <section className="grid gap-4 md:grid-cols-2">
            <InfoBlock label="Customer" value={job.customer.name} />
            <InfoBlock label="Phone" value={job.customer.phone || "Not recorded"} />
            <InfoBlock label="Vehicle registration" value={job.vehicle.registration} />
            <InfoBlock
              label="Vehicle"
              value={[job.vehicle.make, job.vehicle.model].filter(Boolean).join(" ") || "Not recorded"}
            />
            <InfoBlock label="Scheduled" value={formatDisplayDateTime(job.scheduledStart)} />
            <InfoBlock label="Duration" value={`${job.durationMins} minutes`} />
          </section>

          <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Job notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-32 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/35 p-4 text-sm text-[var(--foreground)] print:bg-white">
                  {job.notes || "No notes recorded."}
                </div>
              </CardContent>
            </Card>

            <Card className="print:border print:shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Workshop details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <p>{job.workshop.name}</p>
                <p>{job.workshop.phone || "No phone recorded"}</p>
                <p>{job.workshop.email || "No email recorded"}</p>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
            <SignatureBlock title="Technician notes" />
            <SignatureBlock title="Sign-off" />
          </section>

          <div className="hidden items-center gap-2 text-sm text-[var(--muted-foreground)] print:flex">
            <MaterialIcon name="print" className="text-[18px]" />
            Printed from Workshop Buddy
          </div>
        </CardContent>
      </Card>

      <JobCardEditor job={job} jobTypes={jobTypes} />
    </AppPage>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-white p-4 print:bg-white">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function SignatureBlock({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-white p-4 print:min-h-48">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <div className="mt-4 min-h-40 rounded-2xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)]/25 print:bg-white" />
    </div>
  );
}
