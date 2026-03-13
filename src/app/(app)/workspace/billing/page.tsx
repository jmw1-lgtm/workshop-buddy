import { BillingContent } from "@/components/billing/billing-content";
import { formatDisplayDate } from "@/lib/dates";
import { requireCurrentWorkshop } from "@/lib/workshop";
import {
  getStripeSubscriptionSummary,
  getTrialDaysRemaining,
  getWorkshopSubscription,
  isSubscriptionActiveForAccess,
} from "@/services/subscriptions";

type InAppBillingPageProps = {
  searchParams?: Promise<{
    checkout?: string;
    error?: string;
  }>;
};

export default async function InAppBillingPage({
  searchParams,
}: InAppBillingPageProps) {
  const tenant = await requireCurrentWorkshop();
  const subscription = await getWorkshopSubscription(tenant.workshopId);
  const params = searchParams ? await searchParams : undefined;
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
      workshopName={tenant.workshopName}
      status={subscription?.status ?? "CANCELLED"}
      trialDaysRemaining={trialDaysRemaining}
      hasAccess={subscription ? isSubscriptionActiveForAccess(subscription) : false}
      checkoutStatus={params?.checkout}
      error={params?.error}
      activePlanLabel={stripeSubscriptionSummary?.planLabel ?? null}
      nextBillingDate={
        stripeSubscriptionSummary?.nextBillingDate
          ? formatDisplayDate(stripeSubscriptionSummary.nextBillingDate)
          : null
      }
      standalone={false}
    />
  );
}
