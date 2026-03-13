import { ReactNode } from "react";

import { requireActiveTenantContext } from "@/auth/tenant";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  getTrialBadgeLabel,
  getTrialBadgeVariant,
  getTrialDaysRemaining,
  getWorkshopSubscription,
} from "@/services/subscriptions";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const tenant = await requireActiveTenantContext();
  const subscription = await getWorkshopSubscription(tenant.workshopId);
  const trialDaysRemaining =
    subscription?.status === "TRIAL"
      ? getTrialDaysRemaining(subscription.trialEndsAt)
      : null;

  return (
    <div className="h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] print:h-auto print:overflow-visible">
      <div className="flex h-full min-h-0 w-full print:block print:h-auto">
        <div className="hidden h-full w-[272px] shrink-0 border-r border-white/10 md:flex print:hidden">
          <AppSidebar />
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-1 w-full flex-col overflow-hidden print:block print:h-auto print:overflow-visible">
          <AppHeader
            workshopName={tenant.workshopName}
            emailAddress={tenant.emailAddress}
            trialBadgeLabel={
              trialDaysRemaining ? getTrialBadgeLabel(trialDaysRemaining) : null
            }
            trialBadgeVariant={
              trialDaysRemaining ? getTrialBadgeVariant(trialDaysRemaining) : "info"
            }
          />
          <main className="min-h-0 min-w-0 w-full flex-1 overflow-y-auto p-4 sm:p-6 print:overflow-visible print:p-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
