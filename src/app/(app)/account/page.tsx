import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/components/layout/material-icon";
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

type AccountPageProps = {
  searchParams?: Promise<{
    checkout?: string;
    error?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const tenant = await requireCurrentWorkshop();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
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
  const errorMessage = getCheckoutErrorMessage(resolvedSearchParams?.error);

  return (
    <AppPage>
      <section className="grid gap-4">
        {resolvedSearchParams?.checkout === "success" ? (
          <AccountStatusBanner
            icon="check_circle"
            title="Stripe checkout completed"
            description="Your subscription is active and workshop access remains available."
            tone="success"
          />
        ) : null}

        {errorMessage ? (
          <AccountStatusBanner
            icon="error"
            title="Unable to start checkout"
            description={errorMessage}
            tone="error"
          />
        ) : null}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Subscription status</CardTitle>
            <CardDescription>
              Manage the subscription for {tenant.workshopName}.
            </CardDescription>
          </CardHeader>
          <CardContent
            className={`grid gap-3 pt-0 ${stripeSubscriptionSummary?.nextBillingDate ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
          >
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
                {stripeSubscriptionSummary?.nextBillingDate ? (
                  <StatusCard
                    label="Next billing date"
                    value={formatDisplayDate(stripeSubscriptionSummary.nextBillingDate)}
                  />
                ) : null}
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
            <PlanOptions
              disabled={subscription?.status === "ACTIVE"}
              returnPath="/account"
            />
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

function getCheckoutErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  switch (error) {
    case "checkout-unavailable":
      return "Stripe checkout is temporarily unavailable. Please try again.";
    default:
      return decodeURIComponent(error);
  }
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

function AccountStatusBanner({
  icon,
  title,
  description,
  tone,
}: {
  icon: string;
  title: string;
  description: string;
  tone: "success" | "error";
}) {
  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClasses}`}>
      <div className="flex items-start gap-3">
        <MaterialIcon name={icon} className="mt-0.5 text-[20px]" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}
