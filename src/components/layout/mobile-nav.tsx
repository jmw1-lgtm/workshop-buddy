"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAppNavigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  showAdminLink?: boolean;
};

export function MobileNav({ showAdminLink = false }: MobileNavProps) {
  const pathname = usePathname();
  const navigation = getAppNavigation({ includeAdmin: showAdminLink });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <MaterialIcon name="menu" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="left-0 top-0 h-full max-w-xs -translate-x-0 -translate-y-0 rounded-none border-r bg-[var(--sidebar-background)] p-4 text-[var(--sidebar-foreground)]">
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]">
              <MaterialIcon name="build_circle" />
            </div>
            <div>
              <p className="text-sm font-semibold">Workshop Buddy</p>
              <p className="text-xs text-[var(--sidebar-muted)]">Operations shell</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3",
                    isActive ? "bg-white text-[var(--sidebar-background)]" : "hover:bg-white/8",
                  )}
                >
                  <MaterialIcon name={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
