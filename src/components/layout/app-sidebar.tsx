"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Logo } from "@/components/ui/logo";
import { getAppNavigation } from "@/lib/navigation";
import { businessDetails } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  showAdminLink?: boolean;
};

export function AppSidebar({ showAdminLink = false }: AppSidebarProps) {
  const pathname = usePathname();
  const navigation = getAppNavigation({ includeAdmin: showAdminLink });

  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto bg-[var(--sidebar-background)] px-4 py-5 text-[var(--sidebar-foreground)]">
      <div className="flex flex-col items-center gap-3 px-2 py-3">
        <Logo
          size={80}
          className="flex-col gap-2 text-center"
          imageClassName="size-20"
          textClassName="text-base font-medium normal-case tracking-normal text-[var(--sidebar-foreground)]"
        />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
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
                  isActive
                    ? "bg-[var(--sidebar-accent)]"
                    : "bg-white/6 group-hover:bg-white/10",
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

      <div className="mt-6 border-t border-white/10 px-2 pt-4 text-xs text-[var(--sidebar-muted)]">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/terms" className="transition-colors hover:text-[var(--sidebar-foreground)]">
            Terms
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-[var(--sidebar-foreground)]">
            Privacy
          </Link>
          <a
            href={`mailto:${businessDetails.contactEmail}`}
            className="transition-colors hover:text-[var(--sidebar-foreground)]"
          >
            Contact
          </a>
        </div>
      </div>
    </aside>
  );
}
