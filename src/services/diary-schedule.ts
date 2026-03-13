import { prisma } from "@/db/prisma";

export class DiaryScheduleError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "DiaryScheduleError";
    this.status = status;
  }
}

export async function rescheduleDiaryJob(input: {
  workshopId: string;
  jobId: string;
  scheduledStart: Date;
}) {
  if (Number.isNaN(input.scheduledStart.getTime())) {
    throw new DiaryScheduleError("Selected slot is invalid.", 422);
  }

  await prisma.$transaction(async (tx) => {
    const [workshop, job] = await Promise.all([
      tx.workshop.findUnique({
        where: { id: input.workshopId },
        select: {
          slotLength: true,
          workingDayStartMins: true,
          workingDayEndMins: true,
        },
      }),
      tx.job.findFirst({
        where: {
          id: input.jobId,
          workshopId: input.workshopId,
        },
        select: {
          id: true,
          durationMins: true,
        },
      }),
    ]);

    if (!workshop) {
      throw new DiaryScheduleError("Workshop not found.", 404);
    }

    if (!job) {
      throw new DiaryScheduleError("Job not found.", 404);
    }

    const slotLength = workshop.slotLength === 30 ? 30 : 60;
    const workingDayStartMins = normalizeWorkingDayStart(workshop.workingDayStartMins);
    const workingDayEndMins = normalizeWorkingDayEnd(
      workshop.workingDayEndMins,
      workingDayStartMins,
    );

    const scheduledMinutes =
      input.scheduledStart.getHours() * 60 + input.scheduledStart.getMinutes();

    if (scheduledMinutes < workingDayStartMins || scheduledMinutes >= workingDayEndMins) {
      throw new DiaryScheduleError("Drop target is outside workshop hours.", 422);
    }

    if (scheduledMinutes % slotLength !== 0) {
      throw new DiaryScheduleError("Drop target does not match the workshop slot length.", 422);
    }

    const scheduledEndMins = scheduledMinutes + job.durationMins;

    if (scheduledEndMins > workingDayEndMins) {
      throw new DiaryScheduleError("Job does not fit inside the working day.", 422);
    }

    await tx.job.update({
      where: {
        id: job.id,
      },
      data: {
        scheduledStart: input.scheduledStart,
      },
    });
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
