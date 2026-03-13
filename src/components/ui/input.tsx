import * as React from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-[var(--surface-border)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--ring)]/20",
        className,
      )}
      {...props}
    />
  );
}
