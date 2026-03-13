import { prisma } from "@/db/prisma";

type GetCustomersPageDataInput = {
  workshopId: string;
  query: string;
  customerId?: string;
};

export async function getCustomersPageData({
  workshopId,
  query,
  customerId,
}: GetCustomersPageDataInput) {
  const trimmedQuery = query.trim();

  const customers = await prisma.customer.findMany({
    where: {
      workshopId,
      ...(trimmedQuery
        ? {
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
                vehicles: {
                  some: {
                    registration: {
                      contains: trimmedQuery.toUpperCase(),
                      mode: "insensitive",
                    },
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      phone: true,
      _count: {
        select: {
          vehicles: true,
          jobs: true,
        },
      },
    },
  });

  const selectedCustomerId =
    customerId && customers.some((customer) => customer.id === customerId)
      ? customerId
      : undefined;

  const selectedCustomer = selectedCustomerId
    ? await prisma.customer.findFirst({
        where: {
          id: selectedCustomerId,
          workshopId,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          vehicles: {
            orderBy: {
              registration: "asc",
            },
            select: {
              id: true,
              registration: true,
              make: true,
              model: true,
              year: true,
            },
          },
          jobs: {
            orderBy: {
              scheduledStart: "desc",
            },
            take: 8,
            select: {
              id: true,
              scheduledStart: true,
              durationMins: true,
              status: true,
              vehicle: {
                select: {
                  registration: true,
                },
              },
              jobType: {
                select: {
                  name: true,
                  color: true,
                },
              },
            },
          },
        },
      })
    : null;

  return {
    query: trimmedQuery,
    customers,
    selectedCustomer,
  };
}
