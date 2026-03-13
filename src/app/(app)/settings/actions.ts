"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/db/prisma";
import { timeInputToMinutes } from "@/lib/time";
import { requireCurrentWorkshop } from "@/lib/workshop";

export type SettingsActionState = {
  error: string | null;
  success: string | null;
};

const initialSuccess = (message: string): SettingsActionState => ({
  error: null,
  success: message,
});

export async function updateWorkshopProfile(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const tenant = await requireCurrentWorkshop();

  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!name || !address || !phone || !email) {
    return {
      error: "Workshop name, address, phone, and email are required.",
      success: null,
    };
  }

  await prisma.workshop.update({
    where: {
      id: tenant.workshopId,
    },
    data: {
      name,
      address,
      phone,
      email,
    },
  });

  revalidatePath("/settings");
  return initialSuccess("Workshop profile saved.");
}

export async function updateDiarySettings(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const tenant = await requireCurrentWorkshop();

  const slotLength = Number(formData.get("slotLength"));
  const workingDayStart = formData.get("workingDayStart")?.toString().trim() ?? "";
  const workingDayEnd = formData.get("workingDayEnd")?.toString().trim() ?? "";

  if (slotLength !== 30 && slotLength !== 60) {
    return {
      error: "Slot length must be 30 or 60 minutes.",
      success: null,
    };
  }

  const workingDayStartMins = timeInputToMinutes(workingDayStart);
  const workingDayEndMins = timeInputToMinutes(workingDayEnd);

  if (workingDayStartMins == null || workingDayEndMins == null) {
    return {
      error: "Working day start and end times must be valid.",
      success: null,
    };
  }

  if (workingDayStartMins >= workingDayEndMins) {
    return {
      error: "Working day end time must be after the start time.",
      success: null,
    };
  }

  await prisma.workshop.update({
    where: {
      id: tenant.workshopId,
    },
    data: {
      slotLength,
      workingDayStartMins,
      workingDayEndMins,
    },
  });

  revalidatePath("/settings");
  return initialSuccess("Diary settings saved.");
}

export async function updateJobTypeColors(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const tenant = await requireCurrentWorkshop();

  const jobTypes = await prisma.jobType.findMany({
    where: {
      workshopId: tenant.workshopId,
    },
    select: {
      id: true,
    },
  });

  await prisma.$transaction(
    jobTypes.map((jobType) =>
      prisma.jobType.update({
        where: {
          id: jobType.id,
        },
        data: {
          color: formData.get(`jobType:${jobType.id}`)?.toString().trim() || "#64748B",
        },
      }),
    ),
  );

  revalidatePath("/settings");
  return initialSuccess("Job type colours saved.");
}
