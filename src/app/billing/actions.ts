"use server";

import { redirect } from "next/navigation";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { createSubscriptionCheckoutSession } from "@/services/subscriptions";

async function startSubscriptionCheckout(plan: "monthly" | "yearly") {
  const workshop = await requireCurrentWorkshop();

  try {
    const session = await createSubscriptionCheckoutSession({
      workshopId: workshop.workshopId,
      customerEmail: workshop.emailAddress,
      plan,
    });

    if (!session.url) {
      redirect("/billing?error=checkout-unavailable");
    }

    redirect(session.url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start checkout.";

    redirect(`/billing?error=${encodeURIComponent(message)}`);
  }
}

export async function startMonthlySubscription() {
  await startSubscriptionCheckout("monthly");
}

export async function startYearlySubscription() {
  await startSubscriptionCheckout("yearly");
}
