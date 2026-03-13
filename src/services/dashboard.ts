import { JobStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";
import { addDays, formatDateParam, startOfLocalDay } from "@/lib/dates";
import { minutesToTimeInput } from "@/lib/time";

const NEXT_SLOT_SEARCH_DAYS = 14;

type ScheduledJobWindow = {
  scheduledStart: Date;
  durationMins: number;
};

export type DashboardMetrics = {
  jobsToday: number;
  inProgress: number;
  waitingParts: number;
  waitingCollection: number;
  upcomingWorkload: {
    bookingsNext7Days: number;
    motBookingsNext7Days: number;
    serviceRepairBookingsNext7Days: number;
    busiestUpcomingDay: {
      label: string;
      bookings: number;
    } | null;
  };
  slotLength: 30 | 60;
  workingDayStartMins: number;
  workingDayEndMins: number;
  nextAvailableSlots: Array<{
    startsAt: Date;
    endsAt: Date;
    dateParam: string;
  }>;
};

export async function getDashboardMetrics(workshopId: string): Promise<DashboardMetrics> {
  const now = new Date();
  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const searchEndDay = addDays(todayStart, NEXT_SLOT_SEARCH_DAYS);
  const searchEnd = minutesOnDay(searchEndDay, 24 * 60 - 1);
  const next7DaysEnd = addDays(todayStart, 7);

  const [
    workshop,
    jobsToday,
    inProgress,
    waitingParts,
    waitingCollection,
    upcomingJobs,
    upcomingPlanningJobs,
  ] = await prisma.$transaction([
    prisma.workshop.findUniqueOrThrow({
      where: { id: workshopId },
      select: {
        slotLength: true,
        workingDayStartMins: true,
        workingDayEndMins: true,
      },
    }),
    prisma.job.count({
      where: {
        workshopId,
        scheduledStart: {
          gte: todayStart,
          lt: tomorrowStart,
        },
      },
    }),
    prisma.job.count({
      where: {
        workshopId,
        status: JobStatus.IN_PROGRESS,
      },
    }),
    prisma.job.count({
      where: {
        workshopId,
        status: JobStatus.WAITING_PARTS,
      },
    }),
    prisma.job.count({
      where: {
        workshopId,
        status: JobStatus.WAITING_COLLECTION,
      },
    }),
    prisma.job.findMany({
      where: {
        workshopId,
        status: {
          not: JobStatus.CANCELLED,
        },
        scheduledStart: {
          gte: todayStart,
          lte: searchEnd,
        },
      },
      orderBy: {
        scheduledStart: "asc",
      },
      select: {
        scheduledStart: true,
        durationMins: true,
      },
    }),
    prisma.job.findMany({
      where: {
        workshopId,
        status: {
          not: JobStatus.CANCELLED,
        },
        scheduledStart: {
          gte: todayStart,
          lt: next7DaysEnd,
        },
      },
      orderBy: {
        scheduledStart: "asc",
      },
      select: {
        scheduledStart: true,
        jobType: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const slotLength = workshop.slotLength === 30 ? 30 : 60;
  const workingDayStartMins = sanitizeWorkingMinute(workshop.workingDayStartMins, 8 * 60);
  const workingDayEndMins = sanitizeWorkingMinute(workshop.workingDayEndMins, 18 * 60);
  const nextAvailableSlots =
    workingDayStartMins < workingDayEndMins
      ? findNextAvailableSlots({
          now,
          slotLength,
          workingDayStartMins,
          workingDayEndMins,
          jobs: upcomingJobs,
        })
      : [];
  const upcomingWorkload = summarizeUpcomingWorkload(upcomingPlanningJobs);

  return {
    jobsToday,
    inProgress,
    waitingParts,
    waitingCollection,
    upcomingWorkload,
    slotLength,
    workingDayStartMins,
    workingDayEndMins,
    nextAvailableSlots,
  };
}

function summarizeUpcomingWorkload(
  jobs: Array<{
    scheduledStart: Date;
    jobType: {
      name: string;
    };
  }>,
) {
  const bookingsNext7Days = jobs.length;
  const motBookingsNext7Days = jobs.filter(
    (job) => job.jobType.name.toLowerCase() === "mot",
  ).length;
  const serviceRepairBookingsNext7Days = jobs.filter((job) => {
    const jobTypeName = job.jobType.name.toLowerCase();
    return jobTypeName === "service" || jobTypeName === "repair";
  }).length;

  const bookingsByDay = new Map<string, number>();

  for (const job of jobs) {
    const dateKey = formatDateParam(job.scheduledStart);
    bookingsByDay.set(dateKey, (bookingsByDay.get(dateKey) ?? 0) + 1);
  }

  let busiestUpcomingDay: {
    label: string;
    bookings: number;
  } | null = null;

  for (const [dateKey, bookings] of bookingsByDay.entries()) {
    if (!busiestUpcomingDay || bookings > busiestUpcomingDay.bookings) {
      busiestUpcomingDay = {
        label: new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }).format(new Date(`${dateKey}T00:00:00`)),
        bookings,
      };
    }
  }

  return {
    bookingsNext7Days,
    motBookingsNext7Days,
    serviceRepairBookingsNext7Days,
    busiestUpcomingDay,
  };
}

function findNextAvailableSlots(input: {
  now: Date;
  slotLength: 30 | 60;
  workingDayStartMins: number;
  workingDayEndMins: number;
  jobs: ScheduledJobWindow[];
}) {
  const nextSlots: Array<{
    startsAt: Date;
    endsAt: Date;
    dateParam: string;
  }> = [];
  const today = startOfLocalDay(input.now);

  for (let dayOffset = 0; dayOffset < NEXT_SLOT_SEARCH_DAYS; dayOffset += 1) {
    const day = addDays(today, dayOffset);
    const dayStart = minutesOnDay(day, input.workingDayStartMins);
    const dayEnd = minutesOnDay(day, input.workingDayEndMins);

    let slotStart = dayStart;

    if (dayOffset === 0) {
      slotStart = roundUpToSlotBoundary(
        input.now > dayStart ? input.now : dayStart,
        input.slotLength,
      );
    }

    while (slotStart < dayEnd) {
      const slotEnd = new Date(slotStart.getTime() + input.slotLength * 60_000);

      if (slotEnd > dayEnd) {
        break;
      }

      const overlapsExistingJob = input.jobs.some((job) =>
        doesJobOverlapSlot(job, slotStart, slotEnd),
      );

      if (!overlapsExistingJob) {
        nextSlots.push({
          startsAt: slotStart,
          endsAt: slotEnd,
          dateParam: formatDateParam(slotStart),
        });

        if (nextSlots.length === 3) {
          return nextSlots;
        }
      }

      slotStart = slotEnd;
    }
  }

  return nextSlots;
}

function doesJobOverlapSlot(job: ScheduledJobWindow, slotStart: Date, slotEnd: Date) {
  const jobEnd = new Date(job.scheduledStart.getTime() + job.durationMins * 60_000);

  return job.scheduledStart < slotEnd && jobEnd > slotStart;
}

function roundUpToSlotBoundary(date: Date, slotLength: 30 | 60) {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);

  const minutes = rounded.getMinutes();
  const remainder = minutes % slotLength;

  if (remainder !== 0) {
    rounded.setMinutes(minutes + (slotLength - remainder));
  }

  return rounded;
}

function minutesOnDay(date: Date, totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0, 0);
}

function sanitizeWorkingMinute(value: number, fallback: number) {
  if (!Number.isInteger(value) || value < 0 || value > 24 * 60) {
    return fallback;
  }

  return value;
}

export function formatWorkingDayWindow(startMins: number, endMins: number) {
  return `${minutesToTimeInput(startMins)} - ${minutesToTimeInput(endMins)}`;
}
