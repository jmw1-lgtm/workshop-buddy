import { ReactNode } from "react";

import { requireTenantContext } from "@/auth/tenant";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Badge } from "@/components/ui/badge";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const tenant = await requireTenantContext();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r border-white/10 lg:block">
          <AppSidebar workshopName={tenant.workshopSlug ?? "New workshop"} />
        </div>

        <div className="flex min-h-screen flex-col">
          <AppHeader
            emailAddress={tenant.emailAddress}
            workshopId={tenant.workshopId}
          />
          <main className="flex-1 p-4 sm:p-6">
            {!tenant.workshopId ? (
              <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Badge variant="warning">Setup pending</Badge>
                  <p className="text-sm text-amber-900">
                    No workshop is linked to this Clerk session yet. Keep feature logic tenant-scoped once onboarding is added.
                  </p>
                </div>
              </div>
            ) : null}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
