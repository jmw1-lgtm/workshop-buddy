"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import { appNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  workshopName: string;
};

export function AppSidebar({ workshopName }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col bg-[var(--sidebar-background)] px-4 py-5 text-[var(--sidebar-foreground)]">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]">
            <MaterialIcon name="directions_car" className="text-[22px]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--sidebar-muted)]">
              Workshop Buddy
            </p>
            <p className="text-base font-semibold">{workshopName}</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        {appNavigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
                isActive
                  ? "bg-white text-[var(--sidebar-background)]"
                  : "text-[var(--sidebar-foreground)] hover:bg-white/8",
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-2xl",
                  isActive ? "bg-[var(--sidebar-accent)]" : "bg-white/6 group-hover:bg-white/10",
                )}
              >
                <MaterialIcon name={item.icon} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{item.label}</span>
                <span
                  className={cn(
                    "text-xs",
                    isActive ? "text-slate-600" : "text-[var(--sidebar-muted)]",
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold">Trial foundation</p>
        <p className="mt-2 text-sm leading-6 text-[var(--sidebar-muted)]">
          Billing and onboarding are scaffolded but intentionally not implemented yet.
        </p>
        <Button
          variant="secondary"
          className="mt-4 w-full bg-white/10 text-white hover:bg-white/15"
          asChild
        >
          <Link href="/settings">Open settings</Link>
        </Button>
      </div>
    </aside>
  );
}
