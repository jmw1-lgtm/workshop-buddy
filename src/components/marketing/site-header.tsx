import Link from "next/link";

import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const navigation = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--primary-pale)]/60 bg-[var(--topbar-background)]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-[var(--background)] shadow-[0_14px_24px_rgba(39,76,119,0.18)]">
            <MaterialIcon name="precision_manufacturing" className="text-[20px]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Workshop Buddy</p>
            <p className="text-xs text-[var(--muted-foreground)]">Built for independent workshops</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Start free trial</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
