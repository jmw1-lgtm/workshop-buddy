"use client";

import { useState } from "react";

import { AdminAccountActions } from "@/components/admin/admin-account-actions";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { cn } from "@/lib/utils";
import type { AdminAccountRow } from "@/services/admin";

const headings = [
  "Garage / account",
  "Owner email",
  "Created",
  "Last login",
  "Last activity",
  "Active days",
  "Jobs created",
  "First job",
  "Last job",
  "Activation",
  "Returned",
  "Trial status",
  "Trial end date",
  "Subscription status",
  "Current plan",
  "Actions",
];

export function AdminAccountsTable({ rows }: { rows: AdminAccountRow[] }) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="min-w-[2080px] border-separate border-spacing-0">
        <thead>
          <tr className="bg-[var(--surface-muted)]/45 text-left">
            {headings.map((heading) => (
              <th
                key={heading}
                className={cn(
                  "whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]",
                  heading === "Garage / account" && "sticky left-0 z-20 bg-[var(--surface-muted)]",
                  heading === "Actions" && "sticky right-0 z-20 bg-[var(--surface-muted)]",
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
              <tr key={row.workshopId} className="group bg-white hover:bg-[var(--surface-muted)]/26">
                <Cell className="sticky left-0 z-10 min-w-[190px] bg-white group-hover:bg-[#f9fafb]">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{row.workshopName}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{row.accountStatus}</p>
                </Cell>
                <Cell muted><span className="whitespace-nowrap">{row.ownerEmail ?? "No owner email"}</span></Cell>
                <Cell muted>{formatCompactDate(row.createdAt)}</Cell>
                <Cell muted>{formatTrackedDate(row.lastLoginAt, row.activityTrackingStartedAt)}</Cell>
                <Cell muted>{formatTrackedDate(row.lastActivityAt, row.activityTrackingStartedAt, "No activity yet")}</Cell>
                <Cell>{row.activeDays ?? "Unknown"}</Cell>
                <Cell>{row.jobsCreatedCount}</Cell>
                <Cell muted>{formatOptionalDate(row.firstJobCreatedAt)}</Cell>
                <Cell muted>{formatOptionalDate(row.lastJobCreatedAt)}</Cell>
                <Cell>
                  <AdminStatusBadge
                    tone={row.activated ? "success" : "default"}
                    label={row.activated ? "Activated" : "Not activated"}
                  />
                </Cell>
                <Cell>
                  <AdminStatusBadge
                    tone={row.returned === true ? "success" : "default"}
                    label={row.returned == null ? "Unknown" : row.returned ? "Yes" : "No"}
                  />
                </Cell>
                <Cell>
                  <AdminStatusBadge tone={getTrialTone(row.trialLabel)} label={row.trialLabel} />
                </Cell>
                <Cell muted>{row.trialEndsAt ? formatCompactDate(row.trialEndsAt) : "—"}</Cell>
                <Cell>
                  <AdminStatusBadge
                    tone={getSubscriptionTone(row.subscriptionStatus)}
                    label={row.subscriptionStatus}
                  />
                </Cell>
                <Cell muted>{row.currentPlan ?? "—"}</Cell>
                <td className="sticky right-0 z-10 border-b border-[var(--surface-border)] bg-white px-4 py-3.5 group-hover:bg-[#f9fafb]">
                  <AdminAccountActions
                    row={row}
                    isOpen={isOpen}
                    onToggle={() =>
                      setOpenMenuId((currentId) => currentId === row.workshopId ? null : row.workshopId)
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

function Cell({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        "whitespace-nowrap border-b border-[var(--surface-border)] px-4 py-3.5 text-sm font-medium text-[var(--foreground)]",
        muted && "font-normal text-[var(--muted-foreground)]",
        className,
      )}
    >
      {children}
    </td>
  );
}

function formatCompactDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTrackedDate(
  date: Date | null,
  trackingStartedAt: Date | null,
  emptyTrackedLabel = "No login recorded",
) {
  if (date) {
    return formatCompactDate(date);
  }

  return trackingStartedAt ? emptyTrackedLabel : "Not historically tracked";
}

function formatOptionalDate(date: Date | null) {
  return date ? formatCompactDate(date) : "—";
}

function getTrialTone(label: string) {
  if (label.includes("left")) return "info" as const;
  if (label === "Expired") return "danger" as const;
  return "default" as const;
}

function getSubscriptionTone(label: string) {
  switch (label) {
    case "Active": return "success" as const;
    case "Trial": return "info" as const;
    case "Past due": return "warning" as const;
    case "Cancelled":
    case "Missing": return "danger" as const;
    default: return "default" as const;
  }
}
