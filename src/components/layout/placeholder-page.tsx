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

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryMetric: string;
  metricLabel: string;
  checklist: string[];
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  primaryMetric,
  metricLabel,
  checklist,
}: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <>
            <Badge variant="default">MVP scaffold</Badge>
            <Button>
              <MaterialIcon name="add" className="text-[18px]" />
              Placeholder action
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{primaryMetric}</CardTitle>
            <CardDescription>{metricLabel}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {checklist.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 items-center justify-center rounded-xl bg-white">
                    <MaterialIcon name="check_circle" className="text-emerald-600" />
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{item}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      Reserved for the next implementation phase.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation note</CardTitle>
            <CardDescription>
              This section is intentionally thin to keep the foundation scalable without shipping premature workflow logic.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-[var(--muted-foreground)]">
            <p>
              Routing, auth protection, and layout primitives are in place. Feature data should be added behind tenant-scoped services.
            </p>
            <p>
              The next layer should connect workshop membership, onboarding, and seeded job types before building the full diary.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
