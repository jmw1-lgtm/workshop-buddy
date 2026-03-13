import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanOptions } from "@/components/billing/plan-options";
import { AppPage } from "@/components/layout/app-page";
import { formatDisplayDate } from "@/lib/dates";
import { requireCurrentWorkshop } from "@/lib/workshop";
import {
  getStripeSubscriptionSummary,
  getTrialDaysRemaining,
  getWorkshopSubscription,
} from "@/services/subscriptions";

export default async function AccountPage() {
  const tenant = await requireCurrentWorkshop();
  const subscription = await getWorkshopSubscription(tenant.workshopId);
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
    <AppPage>
      <section className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Subscription status</CardTitle>
            <CardDescription>
              Manage the subscription for {tenant.workshopName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0 sm:grid-cols-3">
            {subscription?.status === "TRIAL" && trialDaysRemaining > 0 ? (
              <>
                <StatusCard label="Status" value="Trial active" />
                <StatusCard
                  label="Days remaining"
                  value={`${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"}`}
                />
                <StatusCard label="Current plan" value="No paid plan yet" />
              </>
            ) : (
              <>
                <StatusCard label="Status" value="Active subscription" />
                <StatusCard
                  label="Current plan"
                  value={stripeSubscriptionSummary?.planLabel ?? "Unknown"}
                />
                <StatusCard
                  label="Next billing date"
                  value={
                    stripeSubscriptionSummary?.nextBillingDate
                      ? formatDisplayDate(stripeSubscriptionSummary.nextBillingDate)
                      : "Unavailable"
                  }
                />
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Plan options</CardTitle>
            <CardDescription>
              Review the available subscription plans.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <PlanOptions disabled={subscription?.status === "ACTIVE"} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Billing management</CardTitle>
            <CardDescription>
              Manage subscription, payment method, and invoice history through Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button type="button" variant="outline" disabled>
              Manage billing
            </Button>
          </CardContent>
        </Card>
      </section>
    </AppPage>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 px-4 py-2.5">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1.5 text-base font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
