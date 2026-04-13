"use server";

import { redirect } from "next/navigation";

import { getCurrentMembership } from "@/lib/workshop";
import { createWorkshopWithOwner } from "@/services/workshops";

export type OnboardingActionState = {
  error: string | null;
};

export async function completeOnboarding(
  _previousState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const result = await getCurrentMembership();

  if (!result) {
    redirect("/sign-in");
  }

  if (result.membership) {
    redirect("/dashboard");
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const address = formData.get("address")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const slotLength = Number(formData.get("slotLength"));
  const defaultHourlyLabourRate = parsePositiveOptionalNumber(
    formData.get("defaultHourlyLabourRate"),
  );

  if (!name || !address || !phone || !email) {
    return {
      error: "All workshop fields are required.",
    };
  }

  if (slotLength !== 30 && slotLength !== 60) {
    return {
      error: "Slot length must be 30 or 60 minutes.",
    };
  }

  if (defaultHourlyLabourRate === "invalid") {
    return {
      error: "Default hourly labour rate must be greater than zero.",
    };
  }

  try {
    await createWorkshopWithOwner({
      clerkUserId: result.clerkUserId,
      name,
      address,
      phone,
      email,
      slotLength,
      defaultHourlyLabourRate,
    });
  } catch {
    return {
      error: "Unable to create the workshop right now. Please try again.",
    };
  }

  redirect("/dashboard");
}

function parsePositiveOptionalNumber(value: FormDataEntryValue | null) {
  const raw = value?.toString().trim() ?? "";

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return "invalid" as const;
  }

  return Math.round(parsed * 100) / 100;
}
