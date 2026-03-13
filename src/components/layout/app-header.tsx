import { UserButton } from "@clerk/nextjs";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AppHeaderProps = {
  workshopName: string;
  emailAddress: string | null;
  trialBadgeLabel?: string | null;
  trialBadgeVariant?: "default" | "warning";
};

export function AppHeader({
  workshopName,
  emailAddress,
  trialBadgeLabel,
  trialBadgeVariant = "default",
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 w-full min-w-0 shrink-0 items-center justify-between border-b border-[var(--surface-border)] bg-[var(--topbar-background)] px-4 backdrop-blur-sm sm:px-6 print:hidden">
      <div className="flex items-center gap-3">
        <MobileNav />
        <p className="truncate text-lg font-semibold text-[var(--foreground)]">
          {workshopName}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {trialBadgeLabel ? (
          <Badge variant={trialBadgeVariant} className="hidden md:inline-flex">
            {trialBadgeLabel}
          </Badge>
        ) : null}
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
