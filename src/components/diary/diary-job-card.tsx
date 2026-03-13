"use client";

import { JobStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CSSProperties } from "react";

import { jobStatusLabels } from "@/lib/job-status";
import { cn } from "@/lib/utils";

type DiaryJobCardProps = {
  job: {
    id: string;
    customerName: string;
    vehicleRegistration: string;
    jobTypeName: string;
    jobTypeColor: string;
    status: JobStatus;
    durationMins: number;
  };
  compact?: boolean;
  density?: "small" | "medium" | "large";
  view?: "day" | "week";
  draggable?: boolean;
  isPending?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export function DiaryJobCard({
  job,
  compact = false,
  density,
  view = "day",
  draggable = false,
  isPending = false,
  onDragStart,
  onDragEnd,
}: DiaryJobCardProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const statusTone = getStatusTone(job.status);
  const statusLabel = job.status === "BOOKED" ? "Scheduled" : jobStatusLabels[job.status];
  const resolvedDensity = compact ? "small" : density ?? "large";
  const isWeekView = view === "week";
  const showCustomer = resolvedDensity === "medium" || resolvedDensity === "large";
  const showJobType = resolvedDensity === "large";
  const showDuration = resolvedDensity === "large";
  const weekSecondary = resolvedDensity === "small" ? job.jobTypeName : job.customerName;

  return (
    <article
      role="link"
      tabIndex={0}
      draggable={draggable}
      onClick={() => {
        if (!isPending) {
          router.push(`/jobs/${job.id}`);
        }
      }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !isPending) {
          event.preventDefault();
          router.push(`/jobs/${job.id}`);
        }
      }}
      onDragStart={(event) => {
        if (!draggable) {
          return;
        }

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", job.id);
        setIsDragging(true);
        onDragStart?.();
      }}
      onDragEnd={() => {
        setIsDragging(false);
        onDragEnd?.();
      }}
      className={cn(
        "relative flex h-full w-full min-w-0 max-w-full cursor-pointer flex-col overflow-hidden rounded-3xl border text-left shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-px hover:border-[var(--primary)]/30 hover:shadow-[0_18px_34px_rgba(15,23,42,0.12)]",
        isWeekView ? (resolvedDensity === "small" ? "p-3.5" : "p-4") : resolvedDensity === "small" ? "p-3" : "p-4",
        isPending ? "cursor-wait opacity-70" : "",
        isDragging ? "z-20 -translate-y-1 shadow-[0_22px_42px_rgba(15,23,42,0.18)]" : "",
      )}
      style={{
        borderColor: `${job.jobTypeColor}45`,
        backgroundColor: colorWithAlpha(
          job.jobTypeColor,
          resolvedDensity === "small" ? 0.1 : 0.14,
        ),
      }}
      aria-label={`Open job card for ${job.vehicleRegistration}`}
    >
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: job.jobTypeColor }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex h-full flex-col pl-2",
          isWeekView
            ? resolvedDensity === "small"
              ? "gap-2"
              : "gap-2.5"
            : resolvedDensity === "small"
            ? "gap-2"
            : resolvedDensity === "medium"
              ? "gap-2.5"
              : "gap-3",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={cn(
                "truncate font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]",
                resolvedDensity === "small" ? "text-base" : "text-lg",
              )}
            >
              {job.vehicleRegistration}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full font-semibold",
              isWeekView
                ? "max-w-[40%] truncate px-2 py-1 text-[10px]"
                : resolvedDensity === "small"
                  ? "shrink-0 px-2 py-1 text-[10px]"
                  : "shrink-0 px-2.5 py-1 text-[11px]",
            )}
            style={statusTone}
            title={statusLabel}
          >
            {statusLabel}
          </span>
        </div>
        {isWeekView ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {weekSecondary}
            </p>
          </div>
        ) : showCustomer ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {job.customerName}
            </p>
          </div>
        ) : null}
        {showJobType ? (
          <div>
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                backgroundColor: colorWithAlpha(job.jobTypeColor, 0.16),
                color: job.jobTypeColor,
              }}
            >
              {job.jobTypeName}
            </span>
          </div>
        ) : null}
        {isWeekView ? null : (
          <div className="mt-auto flex items-center justify-between gap-3 text-xs text-[var(--muted-foreground)]">
            {showDuration ? <span>{job.durationMins} minutes</span> : <span>{job.jobTypeName}</span>}
            {resolvedDensity === "large" && isPending ? (
              <span className="font-semibold text-[var(--primary)]">Moving...</span>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}

function getStatusTone(status: JobStatus): CSSProperties {
  switch (status) {
    case "BOOKED":
      return {
        backgroundColor: "rgba(15, 118, 110, 0.12)",
        color: "var(--primary)",
      };
    case "ARRIVED":
      return {
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        color: "#2563eb",
      };
    case "IN_PROGRESS":
      return {
        backgroundColor: "rgba(15, 118, 110, 0.16)",
        color: "var(--primary-strong)",
      };
    case "WAITING_PARTS":
      return {
        backgroundColor: "rgba(217, 119, 6, 0.14)",
        color: "#b45309",
      };
    case "WAITING_COLLECTION":
      return {
        backgroundColor: "rgba(59, 130, 246, 0.14)",
        color: "#1d4ed8",
      };
    case "COMPLETED":
      return {
        backgroundColor: "rgba(22, 163, 74, 0.14)",
        color: "#15803d",
      };
    case "CANCELLED":
      return {
        backgroundColor: "rgba(239, 68, 68, 0.12)",
        color: "#b91c1c",
      };
  }
}

function colorWithAlpha(color: string, alpha: number) {
  const normalized = color.trim();

  if (/^#([0-9a-f]{6})$/i.test(normalized)) {
    return `${normalized}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }

  if (/^#([0-9a-f]{3})$/i.test(normalized)) {
    const expanded = normalized
      .slice(1)
      .split("")
      .map((char) => `${char}${char}`)
      .join("");

    return `#${expanded}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }

  return color;
}
