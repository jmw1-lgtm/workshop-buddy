import { prisma } from "@/db/prisma";

type GetJobIntakeMatchesInput = {
  workshopId: string;
  query: string;
};

type VehicleSummary = {
  vehicleId: string;
  registration: string;
  make: string | null;
  model: string | null;
  fuel: string | null;
  year: number | null;
  engineSizeCc: number | null;
};

function mapVehicleSummary(vehicle: {
  id: string;
  registration: string;
  make: string | null;
  model: string | null;
  fuel: string | null;
  year: number | null;
  engineSizeCc: number | null;
}): VehicleSummary {
  return {
    vehicleId: vehicle.id,
    registration: vehicle.registration,
    make: vehicle.make,
    model: vehicle.model,
    fuel: vehicle.fuel,
    year: vehicle.year,
    engineSizeCc: vehicle.engineSizeCc,
  };
}

export async function getJobIntakeMatches({
  workshopId,
  query,
}: GetJobIntakeMatchesInput) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const normalizedRegistrationQuery = trimmedQuery.toUpperCase().replace(/\s+/g, "");

  const [vehicles, customers] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        workshopId,
        registration: {
          contains: normalizedRegistrationQuery,
          mode: "insensitive",
        },
      },
      orderBy: [{ updatedAt: "desc" }, { registration: "asc" }],
      take: 6,
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
      },
    }),
    prisma.customer.findMany({
      where: {
        workshopId,
        OR: [
          {
            name: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      take: 6,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        vehicles: {
          orderBy: [{ updatedAt: "desc" }, { registration: "asc" }],
          select: {
            id: true,
            registration: true,
            make: true,
            model: true,
            fuel: true,
            year: true,
            engineSizeCc: true,
          },
        },
      },
    }),
  ]);

  const seenCustomerIds = new Set<string>();

  const vehicleResults = vehicles.map((vehicle) => {
    seenCustomerIds.add(vehicle.customer.id);

    return {
      kind: "vehicle" as const,
      customerId: vehicle.customer.id,
      customerName: vehicle.customer.name,
      customerPhone: vehicle.customer.phone,
      customerEmail: vehicle.customer.email,
      vehicle: mapVehicleSummary(vehicle),
    };
  });

  const customerResults = customers
    .filter((customer) => !seenCustomerIds.has(customer.id))
    .map((customer) => ({
      kind: "customer" as const,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      vehicles: customer.vehicles.map(mapVehicleSummary),
    }));

  return [...vehicleResults, ...customerResults];
}
