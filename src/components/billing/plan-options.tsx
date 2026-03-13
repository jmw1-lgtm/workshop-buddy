import { startMonthlySubscription, startYearlySubscription } from "@/app/billing/actions";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PlanOptionsProps = {
  disabled?: boolean;
};

export function PlanOptions({ disabled = false }: PlanOptionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PlanCard
        title="Monthly"
        price="£49"
        supportingText="Billed monthly"
        description="Includes diary, customers, and job cards."
        bullets={[
          "Diary and booking management",
          "Customer records and vehicles",
          "Job cards and dashboard access",
        ]}
        action={startMonthlySubscription}
        cta="Start monthly subscription"
        disabled={disabled}
      />
      <PlanCard
        title="Yearly"
        price="£490"
        supportingText="Billed yearly"
        description="Includes diary, customers, and job cards."
        bullets={[
          "Everything in Monthly",
          "Lower annual cost",
          "Good fit for established workshops",
        ]}
        badge="Best value"
        action={startYearlySubscription}
        cta="Start yearly subscription"
        disabled={disabled}
      />
    </div>
  );
}

function PlanCard({
  title,
  price,
  supportingText,
  description,
  bullets,
  badge,
  cta,
  action,
  disabled,
}: {
  title: string;
  price: string;
  supportingText: string;
  description: string;
  bullets: string[];
  badge?: string;
  cta: string;
  action: () => Promise<void>;
  disabled: boolean;
}) {
  return (
    <div className="rounded-3xl border border-[var(--surface-border)] bg-white p-4 shadow-[0_10px_24px_rgba(39,76,119,0.05)]">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
            <div className="flex items-end gap-2">
              <p className="text-[2rem] font-semibold leading-none tracking-tight text-[var(--foreground)]">
                {price}
              </p>
              <p className="pb-0.5 text-sm text-[var(--muted-foreground)]">
                {supportingText}
              </p>
            </div>
          </div>
          {badge ? <Badge variant="warning">{badge}</Badge> : null}
        </div>

        <p className="text-sm leading-5 text-[var(--muted-foreground)]">
          {description}
        </p>

        <ul className="space-y-1.5 text-sm text-[var(--foreground)]">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <MaterialIcon
                name="check_circle"
                className="mt-0.5 text-[16px] text-[var(--primary)]"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      <form action={action} className="mt-4">
        <Button className="w-full" disabled={disabled}>
          {disabled ? "Current subscription active" : cta}
        </Button>
      </form>
    </div>
  );
}
