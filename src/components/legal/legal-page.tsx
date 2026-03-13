import Link from "next/link";
import { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  summary,
  children,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <SiteHeader />
      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-[var(--surface-border)] bg-white p-6 shadow-[0_18px_40px_rgba(39,76,119,0.08)] sm:p-10">
          <div className="space-y-4 border-b border-[var(--surface-border)] pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              {summary}
            </p>
          </div>

          <div className="prose prose-slate mt-8 max-w-none prose-headings:font-semibold prose-p:text-[var(--muted-foreground)] prose-li:text-[var(--muted-foreground)]">
            {children}
          </div>

          <div className="mt-10 border-t border-[var(--surface-border)] pt-6 text-sm text-[var(--muted-foreground)]">
            Need help?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
            >
              Sign in
            </Link>{" "}
            or contact support using the details below.
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
