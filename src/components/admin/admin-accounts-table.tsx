"use client";

import { useState } from "react";

import { AdminAccountActions } from "@/components/admin/admin-account-actions";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { MaterialIcon } from "@/components/layout/material-icon";
import { cn } from "@/lib/utils";
import type { AdminAccountRow } from "@/services/admin";

export function AdminAccountsTable({ rows }: { rows: AdminAccountRow[] }) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-[var(--surface-muted)]/45 text-left">
            {[
              "Garage / account",
              "Owner email",
              "Created",
              "Jobs created",
              "Trial status",
              "Trial end date",
              "Subscription status",
              "Current plan",
              "Stripe customer ID",
              "Actions",
            ].map((heading) => (
              <th
                key={heading}
                className={cn(
                  "border-b border-[var(--surface-border)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]",
                  heading === "Actions"
                    ? "sticky right-0 z-10 bg-[var(--surface-muted)]/95"
                    : "",
                )}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOpen = openMenuId === row.workshopId;

            return (
              <tr
                key={row.workshopId}
                className="bg-white transition-colors hover:bg-[var(--surface-muted)]/26"
              >
                <td className="border-b border-[var(--surface-border)] px-4 py-3.5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {row.workshopName}
                  </p>
                </td>
                <td className="border-b border-[var(--surface-border)] px-4 py-3.5 text-sm text-[var(--muted-foreground)]">
                  <span className="whitespace-nowrap">{row.ownerEmail ?? "No owner email"}</span>
                </td>
                <td className="whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5 text-sm text-[var(--muted-foreground)]">
                  {formatCompactDate(row.createdAt)}
                </td>
                <td className="whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5 text-sm font-medium text-[var(--foreground)]">
                  <div className="flex items-center gap-2">
                    <span>{row.jobsCreatedCount}</span>
                    <span
                      className="inline-flex cursor-help items-center text-[var(--muted-foreground)]"
                      title={getActivityTooltip(row)}
                      aria-label={getActivityTooltip(row)}
                    >
                      <MaterialIcon name="info" className="text-[16px]" />
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5">
                  <AdminStatusBadge tone={getTrialTone(row.trialLabel)} label={row.trialLabel} />
                </td>
                <td className="whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5 text-sm text-[var(--muted-foreground)]">
                  {row.trialEndsAt ? formatCompactDate(row.trialEndsAt) : "—"}
                </td>
                <td className="whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5">
                  <AdminStatusBadge
                    tone={getSubscriptionTone(row.subscriptionStatus)}
                    label={row.subscriptionStatus}
                  />
                </td>
                <td className="whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5 text-sm text-[var(--muted-foreground)]">
                  {row.currentPlan ?? "—"}
                </td>
                <td className="border-b border-[var(--surface-border)] px-4 py-3.5 text-sm text-[var(--muted-foreground)]">
                  <span className="font-mono text-[11px] opacity-80">
                    {row.stripeCustomerId ?? "—"}
                  </span>
                </td>
                <td
                  className={cn(
                    "sticky right-0 border-b border-[var(--surface-border)] bg-white px-4 py-3.5 align-top",
                    isOpen ? "z-40" : "z-20",
                  )}
                >
                  <AdminAccountActions
                    workshopId={row.workshopId}
                    workshopName={row.workshopName}
                    subscriptionStatus={row.subscriptionStatus}
                    hasStripeCustomer={Boolean(row.stripeCustomerId)}
                    isOpen={isOpen}
                    onToggle={() =>
                      setOpenMenuId((currentId) =>
                        currentId === row.workshopId ? null : row.workshopId,
                      )
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatCompactDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getActivityTooltip(row: AdminAccountRow) {
  return [
    `Last job created: ${formatActivityDate(row.lastJobCreatedAt)}`,
    `Last customer created: ${formatActivityDate(row.lastCustomerCreatedAt)}`,
  ].join("\n");
}

function formatActivityDate(date: Date | null) {
  if (!date) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getTrialTone(label: string) {
  if (label.includes("left")) {
    return "info" as const;
  }

  if (label === "Expired") {
    return "danger" as const;
  }

  return "default" as const;
}

function getSubscriptionTone(label: string) {
  switch (label) {
    case "Active":
      return "success" as const;
    case "Trial":
      return "info" as const;
    case "Past due":
      return "warning" as const;
    case "Cancelled":
    case "Missing":
      return "danger" as const;
    default:
      return "default" as const;
  }
}
