import { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 rounded-3xl border border-[var(--surface-border)] bg-white p-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          {eyebrow}
        </p>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
            {description}
          </p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
