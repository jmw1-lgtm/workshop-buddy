import { prisma } from "@/db/prisma";

export async function getWorkshopSettingsData(workshopId: string) {
  return prisma.workshop.findUniqueOrThrow({
    where: {
      id: workshopId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
      slotLength: true,
      workingDayStartMins: true,
      workingDayEndMins: true,
      jobTypes: {
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  });
}
