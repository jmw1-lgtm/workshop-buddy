import Link from "next/link";

import { AdminAccountsTable } from "@/components/admin/admin-accounts-table";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Logo } from "@/components/ui/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireAdminUser } from "@/lib/admin";
import { getAdminDashboardData } from "@/services/admin";
import { cn } from "@/lib/utils";

type AdminPageProps = {
  searchParams?: Promise<{
    q?: string;
    filter?: string;
  }>;
};

const filterOptions = [
  { value: "all", label: "All" },
  { value: "trial", label: "Trial" },
  { value: "subscribed", label: "Subscribed" },
  { value: "inactive", label: "Inactive" },
] as const;

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const adminUser = await requireAdminUser();
  const params = searchParams ? await searchParams : undefined;
  const data = await getAdminDashboardData({
    search: params?.q,
    filter: params?.filter,
  });
  const activeFilter = filterOptions.some((option) => option.value === params?.filter)
    ? params?.filter
    : "all";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(231,236,239,0.62),rgba(248,250,252,0.92)_24%,rgba(248,250,252,1)_100%)] text-[var(--foreground)]">
      <header className="border-b border-[var(--surface-border)] bg-[var(--topbar-background)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo
              size={28}
              imageClassName="size-7"
              textClassName="text-sm font-semibold text-[var(--foreground)]"
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
              <MaterialIcon name="shield_person" className="text-[14px]" />
              Internal admin
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden rounded-full border border-[var(--surface-border)] bg-white px-3 py-2 text-sm text-[var(--muted-foreground)] sm:block">
              {adminUser.emailAddress ?? "Admin user"}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white px-3 py-2 font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
            >
              <MaterialIcon name="arrow_back" className="text-[18px]" />
              Back to app
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-6 sm:px-6">
        <section className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Admin
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Account admin
          </h1>
          <p className="text-sm leading-6 text-[var(--muted-foreground)]">
            Manage garage accounts, trial access, manual activation, and cleanup across the
            Workshop Buddy account base.
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          <SummaryCard
            label="Total accounts"
            value={String(data.summary.totalAccounts)}
            icon="domain"
          />
          <SummaryCard
            label="Active trials"
            value={String(data.summary.activeTrials)}
            icon="hourglass_top"
          />
          <SummaryCard
            label="Active subscriptions"
            value={String(data.summary.activeSubscriptions)}
            icon="verified"
          />
          <SummaryCard
            label="Inactive / cancelled"
            value={String(data.summary.inactiveCancelled)}
            icon="pause_circle"
          />
        </section>

        <Card className="overflow-visible shadow-[0_18px_44px_rgba(39,76,119,0.08)]">
          <CardHeader className="gap-4 border-b border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(231,236,239,0.72))] pb-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Garage accounts</CardTitle>
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">
                Internal operations view for onboarding state, billing status, and manual
                account controls. Manual changes can temporarily override Stripe-synced state.
              </p>
            </div>
            <form className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex w-full max-w-2xl gap-3">
                <div className="relative w-full max-w-[680px]">
                  <MaterialIcon
                    name="search"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[var(--muted-foreground)]"
                  />
                  <Input
                    name="q"
                    defaultValue={params?.q ?? ""}
                    placeholder="Search garage name or owner email"
                    className="h-11 border-[var(--surface-border)] bg-white pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white p-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="submit"
                    name="filter"
                    value={option.value}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                      activeFilter === option.value
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-muted)]",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </form>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {data.rows.length ? (
              <AdminAccountsTable rows={data.rows} />
            ) : (
              <div className="px-6 py-10 text-sm text-[var(--muted-foreground)]">
                No garages matched the current search or filter.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card className="shadow-[0_14px_36px_rgba(39,76,119,0.07)]">
      <CardContent className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
            <p className="text-[2rem] font-semibold leading-none tracking-tight text-[var(--foreground)]">
              {value}
            </p>
          </div>
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--primary)]">
            <MaterialIcon name={icon} className="text-[22px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
