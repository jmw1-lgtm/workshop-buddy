"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { createBillingPortalSession } from "@/services/subscriptions";

function getReturnPath(formData: FormData) {
  const returnPath = formData.get("returnPath")?.toString().trim();

  return returnPath && returnPath.startsWith("/") ? returnPath : "/account";
}

export async function openBillingPortal(formData: FormData) {
  const workshop = await requireCurrentWorkshop();
  const returnPath = getReturnPath(formData);

  try {
    const session = await createBillingPortalSession({
      workshopId: workshop.workshopId,
      returnPath,
    });

    if (!session.url) {
      console.error("[billing] Stripe billing portal session missing redirect URL.", {
        workshopId: workshop.workshopId,
      });
      redirect(`${returnPath}?portalError=portal-unavailable`);
    }

    redirect(session.url);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unable to open billing portal.";

    console.error("[billing] Failed to create Stripe billing portal session.", {
      workshopId: workshop.workshopId,
      message,
    });

    redirect(`${returnPath}?portalError=${encodeURIComponent(message)}`);
  }
}
