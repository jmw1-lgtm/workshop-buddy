import { redirect } from "next/navigation";

import { BillingContent } from "@/components/billing/billing-content";
import { formatDisplayDate } from "@/lib/dates";
import { IN_APP_ACCOUNT_PATH } from "@/lib/paths";
import { getCurrentMembership } from "@/lib/workshop";
import {
  getStripeSubscriptionSummary,
  getTrialDaysRemaining,
  getWorkshopSubscription,
  isSubscriptionActiveForAccess,
} from "@/services/subscriptions";

type BillingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
    error?: string;
  }>;
};

function buildInAppBillingRedirect(params?: { checkout?: string; error?: string }) {
  const search = new URLSearchParams();

  if (params?.checkout) {
    search.set("checkout", params.checkout);
  }

  if (params?.error) {
    search.set("error", params.error);
  }

  const query = search.toString();

  return query ? `${IN_APP_ACCOUNT_PATH}?${query}` : IN_APP_ACCOUNT_PATH;
}

export default async function StandaloneBillingPage({
  searchParams,
}: BillingPageProps) {
  const membershipResult = await getCurrentMembership();

  if (!membershipResult) {
    redirect("/sign-in");
  }

  if (!membershipResult.membership) {
    redirect("/onboarding");
  }

  const params = searchParams ? await searchParams : undefined;
  const subscription = await getWorkshopSubscription(
    membershipResult.membership.workshopId,
  );

  if (subscription && isSubscriptionActiveForAccess(subscription)) {
    redirect(buildInAppBillingRedirect(params));
  }

  const trialDaysRemaining = subscription
    ? getTrialDaysRemaining(subscription.trialEndsAt)
    : 0;
  const stripeSubscriptionSummary =
    subscription?.status === "ACTIVE" && subscription.stripeSubscriptionId
      ? await getStripeSubscriptionSummary(subscription.stripeSubscriptionId).catch(
          () => null,
        )
      : null;

  return (
    <BillingContent
      workshopName={membershipResult.membership.workshop.name}
      status={subscription?.status ?? "CANCELLED"}
      trialDaysRemaining={trialDaysRemaining}
      hasAccess={false}
      checkoutStatus={params?.checkout}
      error={params?.error}
      activePlanLabel={stripeSubscriptionSummary?.planLabel ?? null}
      nextBillingDate={
        stripeSubscriptionSummary?.nextBillingDate
          ? formatDisplayDate(stripeSubscriptionSummary.nextBillingDate)
          : null
      }
      standalone
    />
  );
}
