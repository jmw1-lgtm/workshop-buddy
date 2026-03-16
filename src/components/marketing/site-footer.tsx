import Image from "next/image";
import Link from "next/link";

import { businessDetails } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          <Image
            src="/images/logo.png"
            alt="Workshop Buddy logo"
            width={100}
            height={100}
            className="h-20 w-auto shrink-0 object-contain sm:h-24 lg:h-[100px]"
          />
          <div className="space-y-1">
            <p className="text-base font-semibold text-[var(--sidebar-foreground)] sm:text-lg">
              Workshop Buddy
            </p>
            <p className="max-w-xs text-sm text-[var(--sidebar-muted)]">
              Reception-first workshop operations software for independent garages.
            </p>
          </div>
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
