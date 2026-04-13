import { prisma } from "@/db/prisma";

export async function getWorkshopSettingsData(workshopId: string) {
  const workshop = await prisma.workshop.findUniqueOrThrow({
    where: {
      id: workshopId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
      defaultHourlyLabourRate: true,
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

  return {
    ...workshop,
    defaultHourlyLabourRate: workshop.defaultHourlyLabourRate?.toNumber() ?? null,
  };
}
