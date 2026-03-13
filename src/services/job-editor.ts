import { JobStatus, Prisma } from "@prisma/client";

export const JOB_STATUSES = new Set<JobStatus>([
  "BOOKED",
  "ARRIVED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "WAITING_COLLECTION",
  "COMPLETED",
  "CANCELLED",
]);

export async function getScopedJobType(
  tx: Prisma.TransactionClient,
  workshopId: string,
  jobTypeId: string,
) {
  const jobType = await tx.jobType.findFirst({
    where: {
      id: jobTypeId,
      workshopId,
    },
    select: {
      id: true,
    },
  });

  if (!jobType) {
    throw new Error("Job type not found.");
  }

  return jobType;
}

export async function resolveCustomerAndVehicle(
  tx: Prisma.TransactionClient,
  input: {
    workshopId: string;
    registration: string;
    customerName: string;
    phone?: string;
    email?: string;
    make?: string;
    model?: string;
    fuel?: string;
    year?: number | null;
    engineSizeCc?: number | null;
  },
) {
  const existingVehicle = await tx.vehicle.findFirst({
    where: {
      workshopId: input.workshopId,
      registration: input.registration,
    },
    include: {
      customer: true,
    },
  });

  if (existingVehicle) {
    const customer = await tx.customer.update({
      where: {
        id: existingVehicle.customer.id,
      },
      data: {
        name: input.customerName,
        phone: input.phone || null,
        email: input.email || existingVehicle.customer.email,
      },
    });

    const vehicle = await tx.vehicle.update({
      where: {
        id: existingVehicle.id,
      },
      data: {
        registration: input.registration,
        customerId: customer.id,
        make: input.make || existingVehicle.make,
        model: input.model || existingVehicle.model,
        fuel: input.fuel || existingVehicle.fuel,
        year: input.year ?? existingVehicle.year,
        engineSizeCc: input.engineSizeCc ?? existingVehicle.engineSizeCc,
        engine:
          input.engineSizeCc != null
            ? `${input.engineSizeCc}cc`
            : existingVehicle.engine,
      },
    });

    return { customer, vehicle };
  }

  const customer = await tx.customer.create({
    data: {
      workshopId: input.workshopId,
      name: input.customerName,
      phone: input.phone || null,
      email: input.email || null,
    },
  });

  const vehicle = await tx.vehicle.create({
    data: {
      workshopId: input.workshopId,
      customerId: customer.id,
      registration: input.registration,
      make: input.make || null,
      model: input.model || null,
      fuel: input.fuel || null,
      year: input.year ?? null,
      engineSizeCc: input.engineSizeCc ?? null,
      engine: input.engineSizeCc != null ? `${input.engineSizeCc}cc` : null,
    },
  });

  return { customer, vehicle };
}
