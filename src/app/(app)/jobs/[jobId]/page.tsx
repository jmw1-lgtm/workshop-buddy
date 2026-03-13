import { notFound } from "next/navigation";

import { JobCardEditor } from "@/components/jobs/job-card-editor";
import { AppPage } from "@/components/layout/app-page";
import { PrintJobCardButton } from "@/components/jobs/print-job-card-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const formId = "job-card-form";

  return (
    <AppPage className="print:block print:w-full print:max-w-none print:gap-0">
      <section className="overflow-hidden rounded-[30px] border border-[var(--surface-border)] bg-white shadow-sm print:rounded-none print:border-0 print:shadow-none">
        <div className="border-b border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(231,236,239,0.52),rgba(255,255,255,1))] px-6 py-5 print:bg-white print:px-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="tracking-[0.12em] uppercase">
                  Job Card
                </Badge>
                <Badge variant="success">{job.jobType.name}</Badge>
                <Badge variant="default">{jobStatusLabels[job.status]}</Badge>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                  {job.vehicle.registration}
                </h1>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {job.workshop.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 print:hidden">
              <Button type="submit" form={formId}>
                Save Job Card
              </Button>
              <PrintJobCardButton />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 print:px-0">
          <JobCardEditor job={job} jobTypes={jobTypes} />
        </div>
      </section>
    </AppPage>
  );
}
