import { notFound } from "next/navigation";
import { JobLineItemType, JobStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";

export type JobCardData = {
  id: string;
  jobNumber: number;
  status: JobStatus;
  scheduledStart: Date;
  durationMins: number;
  notes: string | null;
  internalNotes: string | null;
  technicianNotes: string | null;
  workshop: {
    name: string;
    phone: string | null;
    email: string | null;
  };
  customer: {
    name: string;
    phone: string | null;
    email: string | null;
  };
  vehicle: {
    registration: string;
    make: string | null;
    model: string | null;
    fuel: string | null;
    year: number | null;
    engineSizeCc: number | null;
  };
  jobType: {
    id: string;
    name: string;
    color: string;
  };
  lineItems: Array<{
    id: string;
    description: string;
    itemType: JobLineItemType;
    quantity: number;
    unitPrice: number;
    position: number;
  }>;
};

export async function getJobCardData(input: {
  workshopId: string;
  jobId: string;
}): Promise<JobCardData> {
  const job = await prisma.job.findFirst({
    where: {
      id: input.jobId,
      workshopId: input.workshopId,
    },
    select: {
      id: true,
      jobNumber: true,
      status: true,
      scheduledStart: true,
      durationMins: true,
      notes: true,
      internalNotes: true,
      technicianNotes: true,
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
      lineItems: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          description: true,
          itemType: true,
          quantity: true,
          unitPrice: true,
          position: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  return {
    ...job,
    lineItems: job.lineItems.map((lineItem) => ({
      ...lineItem,
      itemType: lineItem.itemType,
      quantity: lineItem.quantity.toNumber(),
      unitPrice: lineItem.unitPrice.toNumber(),
    })),
  };
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
