import { redirect } from "next/navigation";

import { MaterialIcon } from "@/components/layout/material-icon";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentMembership } from "@/lib/workshop";
import {
  getWorkshopSubscription,
  isSubscriptionActiveForAccess,
} from "@/services/subscriptions";

export default async function OnboardingPage() {
  const result = await getCurrentMembership();

  if (!result) {
    redirect("/sign-in");
  }

  if (result.membership) {
    const subscription = await getWorkshopSubscription(result.membership.workshopId);

    if (subscription && isSubscriptionActiveForAccess(subscription)) {
      redirect("/dashboard");
    }

    redirect("/billing");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.16),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-transparent bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
          <CardHeader className="space-y-5">
            <div className="flex size-14 items-center justify-center rounded-3xl bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]">
              <MaterialIcon name="storefront" className="text-[28px]" />
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">
                Welcome to Workshop Buddy
              </p>
              <CardTitle className="text-4xl text-white">
                Set up your workshop in a minute.
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-slate-300">
            <p>
              Add your workshop details so you can start booking jobs, managing
              customers, and running the day from one clear diary.
            </p>
            <div className="grid gap-3">
              {[
                "Create your workshop profile",
                "Link your account as the owner",
                "Start booking jobs in the diary",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <OnboardingForm defaultEmail={result.emailAddress ?? ""} />
      </div>
    </div>
  );
}
