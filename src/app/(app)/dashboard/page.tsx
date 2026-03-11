import { MaterialIcon } from "@/components/layout/material-icon";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dashboardStats = [
  { label: "Jobs today", value: "0", icon: "today" },
  { label: "In progress", value: "0", icon: "build" },
  { label: "Waiting parts", value: "0", icon: "package_2" },
  { label: "Waiting collection", value: "0", icon: "local_shipping" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Workshop control panel"
        description="This is the initial operational shell. Wire dashboard metrics through tenant-scoped services once workshop onboarding and seed data exist."
        actions={
          <>
            <Badge variant="success">Protected route</Badge>
            <Button>
              <MaterialIcon name="add" className="text-[18px]" />
              New job
            </Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <Card key={item.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="mt-2 text-4xl">{item.value}</CardTitle>
              </div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)]">
                <MaterialIcon name={item.icon} className="text-[var(--primary)]" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Next available slot</CardTitle>
            <CardDescription>
              Reserved for onboarding-driven slot settings and diary availability logic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl border border-dashed border-[var(--surface-border)] bg-[var(--surface-muted)] p-10 text-center">
              <p className="text-sm font-semibold text-[var(--foreground)]">No scheduling logic yet</p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Keep the diary as the source of truth once jobs and slot rules are implemented.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation priorities</CardTitle>
            <CardDescription>
              The MVP should continue from the foundation in the order that supports real workshop workflows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Persist workshop membership and workshop selection",
              "Seed default job types and slot length",
              "Introduce tenant-safe dashboard service queries",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
