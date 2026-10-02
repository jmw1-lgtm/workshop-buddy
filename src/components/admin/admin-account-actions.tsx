"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { manageAdminAccount, type AdminAccountActionState } from "@/app/admin/actions";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminAccountRow } from "@/services/admin";

const initialState: AdminAccountActionState = { error: null, success: null };

function SubmitButton({
  label,
  intent,
  variant = "outline",
}: {
  label: string;
  intent: "activate" | "trial-reset" | "cancel" | "delete";
  variant?: "default" | "outline" | "secondary";
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" name="intent" value={intent} variant={variant} size="sm" disabled={pending}>
      {pending ? "Working..." : label}
    </Button>
  );
}

export function AdminAccountActions({
  row,
  isOpen,
  onToggle,
}: {
  row: AdminAccountRow;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [state, formAction] = useActionState(manageAdminAccount, initialState);

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex min-w-[132px] items-center justify-between gap-2 rounded-xl border border-[var(--surface-border)] bg-white px-2.5 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-muted)]"
      >
        <span className="inline-flex items-center gap-2">
          <MaterialIcon name="manage_accounts" className="text-[18px]" />
          Manage
        </span>
        <MaterialIcon name="chevron_right" className="text-[18px]" />
      </button>

      <Dialog open={isOpen} onOpenChange={(open) => !open && isOpen && onToggle()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{row.workshopName}</DialogTitle>
            <DialogDescription>
              Internal account activity and subscription controls. Activity contains operational
              timestamps only, not customer, vehicle, or job content.
            </DialogDescription>
          </DialogHeader>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Created" value={formatDateTime(row.createdAt)} />
            <Detail label="Last login" value={formatTracked(row.lastLoginAt, row)} />
            <Detail label="Last meaningful activity" value={formatTracked(row.lastActivityAt, row, "No activity yet")} />
            <Detail label="Active days" value={row.activeDays == null ? "Not historically tracked" : String(row.activeDays)} />
            <Detail label="Total jobs" value={String(row.jobsCreatedCount)} />
            <Detail label="First job created" value={formatOptional(row.firstJobCreatedAt)} />
            <Detail label="Last job created" value={formatOptional(row.lastJobCreatedAt)} />
            <Detail label="Trial start" value={formatOptional(row.trialStartedAt)} />
            <Detail label="Trial end" value={formatOptional(row.trialEndsAt)} />
            <Detail label="Activation" value={row.activated ? "Activated" : "Not activated"} />
            <Detail label="Returned" value={row.returned == null ? "Unknown" : row.returned ? "Yes" : "No"} />
            <Detail label="Subscription" value={row.subscriptionStatus} />
            <Detail label="Current plan" value={row.currentPlan ?? "—"} />
            <Detail label="Stripe customer ID" value={row.stripeCustomerId ?? "—"} mono />
          </section>

          <section className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/45 p-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Activity summary</h3>
            <ol className="mt-3 space-y-3 border-l border-[var(--surface-border)] pl-4">
              <TimelineItem label="Account created" value={formatDateTime(row.createdAt)} />
              <TimelineItem label="First login tracked" value={formatTracked(row.lastLoginAt, row)} />
              <TimelineItem label="First job created" value={formatOptional(row.firstJobCreatedAt)} />
              <TimelineItem label="Most recent activity" value={formatTracked(row.lastActivityAt, row, "No activity yet")} />
              <TimelineItem label={row.accountStatus} value={getAccountStatusDate(row)} />
            </ol>
          </section>

          <form
            action={formAction}
            className="rounded-2xl border border-[var(--surface-border)] p-4"
            onSubmit={(event) => {
              const submitter = event.nativeEvent instanceof SubmitEvent ? event.nativeEvent.submitter : null;
              const intent = submitter instanceof HTMLButtonElement ? submitter.value : null;

              if (intent === "delete" && !window.confirm(
                `Delete ${row.workshopName}? This removes the workshop, memberships, customers, vehicles, jobs, subscription, and activity records.`,
              )) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="workshopId" value={row.workshopId} />
            <input type="hidden" name="workshopName" value={row.workshopName} />
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Account controls</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {row.stripeCustomerId
                    ? "Stripe is linked; later webhook synchronization may replace manual status changes."
                    : "No Stripe customer is linked."}
                </p>
              </div>
              <AdminStatusBadge tone={row.subscriptionStatus === "Active" ? "success" : "default"} label={row.subscriptionStatus} />
            </div>
            <div className="flex flex-wrap gap-2">
              <SubmitButton label="Set account active" intent="activate" variant="default" />
              <SubmitButton label="Reset 14-day trial" intent="trial-reset" />
              <SubmitButton label="Mark inactive" intent="cancel" variant="secondary" />
              <SubmitButton label="Delete account" intent="delete" variant="secondary" />
            </div>
            {state.error ? <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700">{state.error}</p> : null}
            {state.success ? <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{state.success}</p> : null}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Detail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{label}</p>
      <p className={`mt-1 break-words text-sm font-medium text-[var(--foreground)] ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

function TimelineItem({ label, value }: { label: string; value: string }) {
  return (
    <li className="relative text-sm before:absolute before:-left-[21px] before:top-1.5 before:size-2 before:rounded-full before:bg-[var(--primary)]">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <span className="ml-2 text-[var(--muted-foreground)]">{value}</span>
    </li>
  );
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatOptional(date: Date | null) {
  return date ? formatDateTime(date) : "—";
}

function formatTracked(date: Date | null, row: AdminAccountRow, trackedEmpty = "No login recorded") {
  if (date) return formatDateTime(date);
  return row.activityTrackingStartedAt ? trackedEmpty : "Not historically tracked";
}

function getAccountStatusDate(row: AdminAccountRow) {
  if (row.accountStatus === "Expired") return formatOptional(row.trialEndsAt);
  if (row.accountStatus === "Trialling") return `Ends ${formatOptional(row.trialEndsAt)}`;
  return row.subscriptionStatus;
}
