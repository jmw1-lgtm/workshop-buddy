import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
            <MaterialIcon name="precision_manufacturing" className="text-[20px]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Workshop Buddy</p>
            <p className="text-xs text-[var(--muted-foreground)]">Built for independent workshops</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Start trial</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
