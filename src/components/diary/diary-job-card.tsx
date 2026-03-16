"use client";

import { JobStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const resolvedDensity = compact ? "small" : density ?? "large";
  const isWeekView = view === "week";
  const bottomMeta = `${job.durationMins} minutes`;
  const primaryLabel = `${job.vehicleRegistration} - ${job.customerName}`;
  const weekSecondary = job.jobTypeName;

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
        "relative flex h-full min-h-14 w-full min-w-0 max-w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[var(--surface-border)] text-left shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-px hover:border-[var(--primary)]/20 hover:shadow-[0_12px_24px_rgba(15,23,42,0.1)]",
        isWeekView ? (resolvedDensity === "small" ? "p-3.5" : "p-4") : resolvedDensity === "small" ? "p-3" : "p-4",
        isPending ? "cursor-wait opacity-70" : "",
        isDragging ? "z-20 -translate-y-1 shadow-[0_22px_42px_rgba(15,23,42,0.18)]" : "",
      )}
      style={{
        backgroundColor: colorWithAlpha(
          job.jobTypeColor,
          resolvedDensity === "small" ? 0.05 : 0.07,
        ),
      }}
      aria-label={`Open job card for ${job.vehicleRegistration} - ${job.customerName}`}
    >
      <span
        className="absolute inset-y-0 left-0 w-2"
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
              {primaryLabel}
            </p>
          </div>
        </div>
        {isWeekView ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[var(--foreground)]">
              {weekSecondary}
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: job.jobTypeColor }}>
              {job.jobTypeName}
            </p>
          </div>
        )}
        {isWeekView ? null : (
          <div className="mt-auto text-xs font-medium text-[var(--muted-foreground)]">
            <span className="truncate">{bottomMeta}</span>
          </div>
        )}
      </div>
    </article>
  );
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
