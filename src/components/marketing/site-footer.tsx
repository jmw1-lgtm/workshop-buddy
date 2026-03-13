import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { businessDetails } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo
            size={28}
            imageClassName="size-7"
            textClassName="text-sm font-semibold text-[var(--sidebar-foreground)]"
          />
          <p className="text-sm text-[var(--sidebar-muted)]">
            Reception-first workshop operations software for independent garages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--sidebar-muted)]">
          <Link href="/sign-in" className="transition-colors hover:text-[var(--sidebar-foreground)]">
            Sign in
          </Link>
          <Link href="/sign-up" className="transition-colors hover:text-[var(--sidebar-foreground)]">
            Start free trial
          </Link>
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
            {businessDetails.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
