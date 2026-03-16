import { notFound } from "next/navigation";

import { prisma } from "@/db/prisma";

export async function getVehicleEditorData(input: {
  workshopId: string;
  vehicleId?: string;
  customerId?: string;
}) {
  if (input.vehicleId && input.vehicleId !== "new") {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: input.vehicleId,
        workshopId: input.workshopId,
      },
      select: {
        id: true,
        registration: true,
        make: true,
        model: true,
        fuel: true,
        year: true,
        engineSizeCc: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!vehicle) {
      notFound();
    }

    return {
      mode: "edit" as const,
      customer: vehicle.customer,
      vehicle: {
        id: vehicle.id,
        registration: vehicle.registration,
        make: vehicle.make,
        model: vehicle.model,
        fuel: vehicle.fuel,
        year: vehicle.year,
        engineSizeCc: vehicle.engineSizeCc,
        jobCount: vehicle._count.jobs,
      },
    };
  }

  if (!input.customerId) {
    notFound();
  }

  const customer = await prisma.customer.findFirst({
    where: {
      id: input.customerId,
      workshopId: input.workshopId,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
    },
  });

  if (!customer) {
    notFound();
  }

  return {
    mode: "create" as const,
    customer,
    vehicle: null,
  };
}
