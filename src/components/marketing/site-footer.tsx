import Image from "next/image";
import Link from "next/link";

import { marketingLandingPages } from "@/lib/marketing-pages";
import { businessDetails } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--sidebar-background)] text-[var(--sidebar-foreground)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
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

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--sidebar-foreground)]/85">
              Software pages
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[var(--sidebar-muted)]">
              <Link href="/" className="transition-colors hover:text-[var(--sidebar-foreground)]">
                Workshop Buddy overview
              </Link>
              {marketingLandingPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="transition-colors hover:text-[var(--sidebar-foreground)]"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--sidebar-foreground)]/85">
              Company
            </p>
            <div className="mt-4 grid gap-3 text-sm text-[var(--sidebar-muted)]">
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
        </div>
      </div>
    </footer>
  );
}
