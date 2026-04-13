import { notFound } from "next/navigation";

import { JobCardEditor } from "@/components/jobs/job-card-editor";
import { AppPage } from "@/components/layout/app-page";
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
      <JobCardEditor job={job} jobTypes={jobTypes} />
    </AppPage>
  );
}
