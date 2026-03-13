import { notFound } from "next/navigation";

import { prisma } from "@/db/prisma";

export async function getJobCardData(input: {
  workshopId: string;
  jobId: string;
}) {
  const job = await prisma.job.findFirst({
    where: {
      id: input.jobId,
      workshopId: input.workshopId,
    },
    select: {
      id: true,
      status: true,
      scheduledStart: true,
      durationMins: true,
      notes: true,
      workshop: {
        select: {
          name: true,
          phone: true,
          email: true,
        },
      },
      customer: {
        select: {
          name: true,
          phone: true,
          email: true,
        },
      },
      vehicle: {
        select: {
          registration: true,
          make: true,
          model: true,
          fuel: true,
          year: true,
          engineSizeCc: true,
        },
      },
      jobType: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return job;
}

export async function getWorkshopJobTypes(workshopId: string) {
  return prisma.jobType.findMany({
    where: {
      workshopId,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });
}
