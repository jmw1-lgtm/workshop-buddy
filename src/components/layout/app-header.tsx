import { UserButton } from "@clerk/nextjs";

import { MaterialIcon } from "@/components/layout/material-icon";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  emailAddress: string | null;
  workshopId: string | null;
};

export function AppHeader({ emailAddress, workshopId }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--topbar-background)] px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Reception workspace
          </p>
          <h1 className="text-xl font-semibold text-[var(--foreground)]">Workshop overview</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant={workshopId ? "success" : "warning"}>
          {workshopId ? "Workshop linked" : "Workshop not linked"}
        </Badge>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
          <MaterialIcon name="search" className="text-[18px]" />
          Quick search
        </Button>
        <div className="hidden items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-white px-3 py-2 md:flex">
          <Avatar className="size-9">
            <AvatarFallback>
              {(emailAddress?.[0] ?? "W").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold text-[var(--foreground)]">Signed in</p>
            <p className="text-[var(--muted-foreground)]">{emailAddress ?? "Unknown user"}</p>
          </div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
