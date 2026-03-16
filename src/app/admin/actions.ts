"use server";

import { SubscriptionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/db/prisma";
import { requireAdminUser } from "@/lib/admin";

const TRIAL_LENGTH_DAYS = 14;

export type AdminAccountActionState = {
  error: string | null;
  success: string | null;
};

const initialSuccess = (message: string): AdminAccountActionState => ({
  error: null,
  success: message,
});

function addTrialDays(days: number) {
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + days);
  return trialEndsAt;
}

async function upsertSubscription(workshopId: string, data: { status: SubscriptionStatus; trialEndsAt?: Date }) {
  return prisma.subscription.upsert({
    where: {
      workshopId,
    },
    update: {
      status: data.status,
      ...(data.trialEndsAt ? { trialEndsAt: data.trialEndsAt } : {}),
    },
    create: {
      workshopId,
      status: data.status,
      trialEndsAt: data.trialEndsAt ?? addTrialDays(TRIAL_LENGTH_DAYS),
    },
  });
}

export async function manageAdminAccount(
  _previousState: AdminAccountActionState,
  formData: FormData,
): Promise<AdminAccountActionState> {
  await requireAdminUser();

  const workshopId = formData.get("workshopId")?.toString().trim() ?? "";
  const workshopName = formData.get("workshopName")?.toString().trim() ?? "";
  const intent = formData.get("intent")?.toString().trim() ?? "";

  if (!workshopId || !workshopName) {
    return {
      error: "Account details were missing from the request.",
      success: null,
    };
  }

  const workshop = await prisma.workshop.findUnique({
    where: {
      id: workshopId,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!workshop) {
    return {
      error: "Account not found.",
      success: null,
    };
  }

  switch (intent) {
    case "activate": {
      await upsertSubscription(workshop.id, {
        status: "ACTIVE",
      });
      break;
    }
    case "trial-reset": {
      await upsertSubscription(workshop.id, {
        status: "TRIAL",
        trialEndsAt: addTrialDays(TRIAL_LENGTH_DAYS),
      });
      break;
    }
    case "cancel": {
      await upsertSubscription(workshop.id, {
        status: "CANCELLED",
      });
      break;
    }
    case "delete": {
      await prisma.workshop.delete({
        where: {
          id: workshop.id,
        },
      });
      revalidatePath("/admin");
      return initialSuccess(`Deleted ${workshop.name}.`);
    }
    default:
      return {
        error: "Unsupported admin action.",
        success: null,
      };
  }

  revalidatePath("/admin");
  return initialSuccess(getSuccessMessage(intent, workshop.name));
}

function getSuccessMessage(intent: string, workshopName: string) {
  switch (intent) {
    case "activate":
      return `${workshopName} is now active.`;
    case "trial-reset":
      return `${workshopName} now has a fresh ${TRIAL_LENGTH_DAYS}-day trial.`;
    case "cancel":
      return `${workshopName} is now marked inactive.`;
    default:
      return `${workshopName} updated.`;
  }
}
