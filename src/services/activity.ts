import { clerkClient } from "@clerk/nextjs/server";

import { prisma } from "@/db/prisma";
import { getActivityDate } from "@/lib/activity-date";

export async function recordAuthenticatedSession(input: {
  workshopId: string;
  clerkUserId: string;
  clerkSessionId: string;
}) {
  await prisma.workshop.updateMany({
    where: {
      id: input.workshopId,
      activityTrackingStartedAt: null,
    },
    data: { activityTrackingStartedAt: new Date() },
  });

  const alreadyRecorded = await prisma.workshopAuthSession.findUnique({
    where: { clerkSessionId: input.clerkSessionId },
    select: { id: true },
  });

  if (alreadyRecorded) {
    return;
  }

  const clerk = await clerkClient();
  const session = await clerk.sessions.getSession(input.clerkSessionId);

  if (session.userId !== input.clerkUserId) {
    return;
  }

  const loginAt = new Date(session.createdAt);

  if (Number.isNaN(loginAt.getTime())) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    const inserted = await tx.workshopAuthSession.createMany({
      data: {
        workshopId: input.workshopId,
        clerkSessionId: input.clerkSessionId,
        loginAt,
      },
      skipDuplicates: true,
    });

    if (inserted.count === 1) {
      await tx.workshop.updateMany({
        where: {
          id: input.workshopId,
          OR: [{ lastLoginAt: null }, { lastLoginAt: { lt: loginAt } }],
        },
        data: { lastLoginAt: loginAt },
      });
    }
  });
}

export async function recordMeaningfulActivity(workshopId: string, at = new Date()) {
  const activityDate = getActivityDate(at);

  await prisma.$transaction([
    prisma.workshop.updateMany({
      where: {
        id: workshopId,
        OR: [{ lastActivityAt: null }, { lastActivityAt: { lt: at } }],
      },
      data: { lastActivityAt: at },
    }),
    prisma.workshopActivityDay.upsert({
      where: {
        workshopId_activityDate: {
          workshopId,
          activityDate,
        },
      },
      create: {
        workshopId,
        activityDate,
        firstActivityAt: at,
        lastActivityAt: at,
      },
      update: {
        lastActivityAt: at,
      },
    }),
  ]);
}

export async function trackMeaningfulActivity(workshopId: string, at = new Date()) {
  await recordMeaningfulActivity(workshopId, at).catch(() => undefined);
}
