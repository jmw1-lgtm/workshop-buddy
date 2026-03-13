import { JobStatus } from "@prisma/client";

import { prisma } from "@/db/prisma";
import {
  addDays,
  differenceInCalendarDays,
  formatDateParam,
  formatShortDisplayDate,
  formatTimeLabel,
  setTimeOnDate,
  startOfWeek,
  startOfLocalDay,
} from "@/lib/dates";

export type DiarySlot = {
  index: number;
  label: string;
  startsAt: Date;
  dateTimeValue: string;
};

export type DiaryJob = {
  id: string;
  customerName: string;
  customerPhone: string | null;
  vehicleRegistration: string;
  jobTypeId: string;
  jobTypeName: string;
  jobTypeColor: string;
  status: JobStatus;
  durationMins: number;
  scheduledStart: Date;
  notes: string | null;
  slotIndex: number;
  slotSpan: number;
  dayIndex: number;
};

export type DiaryPageData = {
  selectedDate: Date;
  dateParam: string;
  slotLength: 30 | 60;
  slots: DiarySlot[];
  jobTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  jobs: DiaryJob[];
  workingDayStartMins: number;
  workingDayEndMins: number;
};

export type DiaryWeekDay = {
  date: Date;
  dateParam: string;
  label: string;
  shortLabel: string;
  isToday: boolean;
  isSelected: boolean;
};

export type DiaryWeekPageData = DiaryPageData & {
  weekStart: Date;
  weekEnd: Date;
  days: DiaryWeekDay[];
};

type WorkshopDiaryConfig = {
  slotLength: 30 | 60;
  workingDayStartMins: number;
  workingDayEndMins: number;
  jobTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
};

export async function getDiaryPageData(input: {
  workshopId: string;
  date: Date;
}): Promise<DiaryPageData> {
  const dayStart = startOfLocalDay(input.date);
  const dayEnd = addDays(dayStart, 1);
  const workshop = await getWorkshopDiaryConfig(input.workshopId);
  const slotLength = workshop.slotLength;
  const slots = buildDiarySlots(dayStart, slotLength, workshop.workingDayStartMins, workshop.workingDayEndMins);
  const jobs = await getScopedDiaryJobs({
    workshopId: input.workshopId,
    rangeStart: dayStart,
    rangeEnd: dayEnd,
    rangeAnchor: dayStart,
    slotLength,
    workingDayStartMins: workshop.workingDayStartMins,
  });

  return {
    selectedDate: dayStart,
    dateParam: formatDateParam(dayStart),
    slotLength,
    slots,
    jobTypes: workshop.jobTypes,
    jobs,
    workingDayStartMins: workshop.workingDayStartMins,
    workingDayEndMins: workshop.workingDayEndMins,
  };
}

export async function getDiaryWeekPageData(input: {
  workshopId: string;
  date: Date;
}): Promise<DiaryWeekPageData> {
  const selectedDate = startOfLocalDay(input.date);
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = addDays(weekStart, 7);
  const workshop = await getWorkshopDiaryConfig(input.workshopId);
  const slotLength = workshop.slotLength;
  const slots = buildDiarySlots(
    weekStart,
    slotLength,
    workshop.workingDayStartMins,
    workshop.workingDayEndMins,
  );
  const jobs = await getScopedDiaryJobs({
    workshopId: input.workshopId,
    rangeStart: weekStart,
    rangeEnd: weekEnd,
    rangeAnchor: weekStart,
    slotLength,
    workingDayStartMins: workshop.workingDayStartMins,
  });

  return {
    selectedDate,
    dateParam: formatDateParam(selectedDate),
    slotLength,
    slots,
    jobTypes: workshop.jobTypes,
    jobs,
    workingDayStartMins: workshop.workingDayStartMins,
    workingDayEndMins: workshop.workingDayEndMins,
    weekStart,
    weekEnd: addDays(weekEnd, -1),
    days: Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const today = startOfLocalDay(new Date());

      return {
        date,
        dateParam: formatDateParam(date),
        label: formatShortDisplayDate(date),
        shortLabel: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date),
        isToday: formatDateParam(date) === formatDateParam(today),
        isSelected: formatDateParam(date) === formatDateParam(selectedDate),
      };
    }),
  };
}

export function buildDiarySlots(
  date: Date,
  slotLength: 30 | 60,
  workingDayStartMins: number,
  workingDayEndMins: number,
): DiarySlot[] {
  const safeStart = normalizeWorkingDayStart(workingDayStartMins);
  const safeEnd = normalizeWorkingDayEnd(workingDayEndMins, safeStart);
  const totalMinutes = safeEnd - safeStart;
  const totalSlots = Math.max(1, Math.floor(totalMinutes / slotLength));

  return Array.from({ length: totalSlots }, (_, index) => {
    const slotMinutes = safeStart + index * slotLength;
    const startsAt = setTimeOnDate(
      date,
      Math.floor(slotMinutes / 60),
      slotMinutes % 60,
    );

    return {
      index,
      label: formatTimeLabel(startsAt),
      startsAt,
      dateTimeValue: startsAt.toISOString(),
    };
  });
}

async function getWorkshopDiaryConfig(workshopId: string): Promise<WorkshopDiaryConfig> {
  const workshop = await prisma.workshop.findUniqueOrThrow({
    where: { id: workshopId },
    select: {
      id: true,
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
    slotLength: workshop.slotLength === 30 ? 30 : 60,
    workingDayStartMins: normalizeWorkingDayStart(workshop.workingDayStartMins),
    workingDayEndMins: normalizeWorkingDayEnd(
      workshop.workingDayEndMins,
      normalizeWorkingDayStart(workshop.workingDayStartMins),
    ),
    jobTypes: workshop.jobTypes,
  };
}

async function getScopedDiaryJobs(input: {
  workshopId: string;
  rangeStart: Date;
  rangeEnd: Date;
  rangeAnchor: Date;
  slotLength: 30 | 60;
  workingDayStartMins: number;
}) {
  const jobs = await prisma.job.findMany({
    where: {
      workshopId: input.workshopId,
      scheduledStart: {
        gte: input.rangeStart,
        lt: input.rangeEnd,
      },
    },
    orderBy: {
      scheduledStart: "asc",
    },
    select: {
      id: true,
      scheduledStart: true,
      durationMins: true,
      notes: true,
      customer: {
        select: {
          name: true,
          phone: true,
        },
      },
      vehicle: {
        select: {
          registration: true,
        },
      },
      jobType: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      status: true,
    },
  });

  return jobs.map((job) => {
    const dayIndex = Math.max(
      0,
      differenceInCalendarDays(startOfLocalDay(job.scheduledStart), input.rangeAnchor),
    );
    const dayStart = setTimeOnDate(
      startOfLocalDay(job.scheduledStart),
      Math.floor(input.workingDayStartMins / 60),
      input.workingDayStartMins % 60,
    );
    const minutesFromStart = (job.scheduledStart.getTime() - dayStart.getTime()) / 60000;
    const slotIndex = Math.max(0, Math.floor(minutesFromStart / input.slotLength));

    return {
      id: job.id,
      customerName: job.customer.name,
      customerPhone: job.customer.phone,
      vehicleRegistration: job.vehicle.registration,
      jobTypeId: job.jobType.id,
      jobTypeName: job.jobType.name,
      jobTypeColor: job.jobType.color,
      status: job.status,
      durationMins: job.durationMins,
      scheduledStart: job.scheduledStart,
      notes: job.notes,
      slotIndex,
      slotSpan: Math.max(1, Math.ceil(job.durationMins / input.slotLength)),
      dayIndex,
    };
  });
}

function normalizeWorkingDayStart(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 23 * 60) {
    return 8 * 60;
  }

  return value;
}

function normalizeWorkingDayEnd(value: number, start: number) {
  if (!Number.isInteger(value) || value <= start || value > 24 * 60) {
    return Math.max(start + 60, 18 * 60);
  }

  return value;
}
