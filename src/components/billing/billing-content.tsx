import Link from "next/link";

import { CancelSignOutButton } from "@/components/auth/cancel-sign-out-button";
import { PlanOptions } from "@/components/billing/plan-options";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BillingContentProps = {
  workshopName: string;
  status: "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
  trialDaysRemaining: number;
  hasAccess: boolean;
  checkoutStatus?: string;
  error?: string;
  activePlanLabel?: string | null;
  nextBillingDate?: string | null;
  standalone: boolean;
};

const subscriptionStatusLabels = {
  TRIAL: "Free trial",
  ACTIVE: "Active",
  PAST_DUE: "Past due",
  CANCELLED: "Cancelled",
} as const;

export function BillingContent({
  workshopName,
  status,
  trialDaysRemaining,
  hasAccess,
  checkoutStatus,
  error,
  activePlanLabel,
  nextBillingDate,
  standalone,
}: BillingContentProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Billing
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Keep {workshopName} running
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
              {status === "ACTIVE"
                ? "Your workshop is live on an active subscription. You can review billing here at any time."
                : status === "TRIAL" && trialDaysRemaining > 0
                  ? `Your free trial ends in ${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"}. Choose a plan to keep using Workshop Buddy without interruption.`
                  : "Your free trial has ended. Choose a plan to continue using Workshop Buddy."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {hasAccess ? (
              <Button asChild variant="outline">
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
            ) : null}
            {standalone ? <CancelSignOutButton /> : null}
          </div>
        </div>

        {checkoutStatus === "success" ? (
          <StatusBanner
            icon="check_circle"
            title="Subscription started"
            description="Stripe checkout completed. Your workshop access is now active."
          />
        ) : null}

        {error ? (
          <StatusBanner
            icon="error"
            title="Unable to start checkout"
            description={error}
            tone="error"
          />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--surface-border)] bg-[var(--surface-muted)]/55">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Badge
                    variant={
                      status === "ACTIVE"
                        ? "success"
                        : status === "TRIAL"
                          ? "warning"
                          : "default"
                    }
                  >
                    {subscriptionStatusLabels[status]}
                  </Badge>
                  <CardTitle className="text-2xl">
                    {status === "ACTIVE"
                      ? "Active subscription"
                      : status === "TRIAL" && trialDaysRemaining > 0
                        ? "Free trial active"
                        : "Choose your plan"}
                  </CardTitle>
                  <CardDescription>
                    {status === "ACTIVE"
                      ? "Your subscription is live. Billing details are shown below for reference."
                      : status === "TRIAL" && trialDaysRemaining > 0
                        ? `${trialDaysRemaining} day${trialDaysRemaining === 1 ? "" : "s"} remaining. You can upgrade early at any point.`
                        : "Continue with secure Stripe checkout. Your workshop data stays in place and access restores as soon as payment completes."}
                  </CardDescription>
                </div>

                <div className="hidden size-14 items-center justify-center rounded-3xl bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] sm:flex">
                  <MaterialIcon name="credit_card" className="text-[28px]" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 py-6">
              {status === "ACTIVE" ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <BillingInfoCard label="Status" value="Active subscription" />
                  <BillingInfoCard
                    label="Plan"
                    value={activePlanLabel ?? "Unknown"}
                  />
                  <BillingInfoCard
                    label="Next billing date"
                    value={nextBillingDate ?? "Unavailable"}
                  />
                </div>
              ) : null}

              {status === "TRIAL" && trialDaysRemaining > 0 ? (
                <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 px-4 py-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Free trial active
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {trialDaysRemaining} day{trialDaysRemaining === 1 ? "" : "s"} remaining
                  </p>
                </div>
              ) : null}

              <PlanOptions disabled={status === "ACTIVE"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What happens next</CardTitle>
              <CardDescription>
                A quick, customer-facing summary before you continue to checkout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-[var(--muted-foreground)]">
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 px-4 py-3">
                Secure checkout with Stripe
              </div>
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 px-4 py-3">
                Access restores as soon as payment completes
              </div>
              <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 px-4 py-3">
                Your workshop data stays in place
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BillingInfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function StatusBanner({
  icon,
  title,
  description,
  tone = "success",
}: {
  icon: string;
  title: string;
  description: string;
  tone?: "success" | "error";
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
