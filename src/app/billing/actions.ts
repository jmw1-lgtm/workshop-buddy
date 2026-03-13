"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { createSubscriptionCheckoutSession } from "@/services/subscriptions";

function getReturnPath(formData: FormData) {
  const returnPath = formData.get("returnPath")?.toString().trim();

  return returnPath && returnPath.startsWith("/") ? returnPath : "/billing";
}

async function startSubscriptionCheckout(plan: "monthly" | "yearly", formData: FormData) {
  const workshop = await requireCurrentWorkshop();
  const returnPath = getReturnPath(formData);

  try {
    const session = await createSubscriptionCheckoutSession({
      workshopId: workshop.workshopId,
      customerEmail: workshop.emailAddress,
      plan,
    });

    if (!session.url) {
      console.error("[billing] Stripe checkout session missing redirect URL.", {
        workshopId: workshop.workshopId,
        plan,
      });
      redirect(`${returnPath}?error=checkout-unavailable`);
    }

    redirect(session.url);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unable to start checkout.";
    console.error("[billing] Failed to create Stripe checkout session.", {
      workshopId: workshop.workshopId,
      plan,
      message,
    });

    redirect(`${returnPath}?error=${encodeURIComponent(message)}`);
  }
}

export async function startMonthlySubscription(formData: FormData) {
  await startSubscriptionCheckout("monthly", formData);
}

export async function startYearlySubscription(formData: FormData) {
  await startSubscriptionCheckout("yearly", formData);
}
