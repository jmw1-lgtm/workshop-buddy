import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-2xl border border-[var(--surface-border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--ring)]/20",
        className,
      )}
      {...props}
    />
  );
}
