import { JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/db/prisma";
import { quickJobStatusOptions } from "@/lib/job-status";

export class JobStatusUpdateError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "JobStatusUpdateError";
    this.status = status;
  }
}

export async function updateJobStatus(input: {
  workshopId: string;
  jobId: string;
  status: JobStatus;
}) {
  if (!quickJobStatusOptions.includes(input.status)) {
    throw new JobStatusUpdateError("Status is invalid.", 422);
  }

  const job = await prisma.job.findFirst({
    where: {
      id: input.jobId,
      workshopId: input.workshopId,
    },
    select: {
      id: true,
    },
  });

  if (!job) {
    throw new JobStatusUpdateError("Job not found.", 404);
  }

  await prisma.job.update({
    where: {
      id: job.id,
    },
    data: {
      status: input.status,
    },
  });

  revalidatePath("/diary");
  revalidatePath(`/jobs/${job.id}`);
}
