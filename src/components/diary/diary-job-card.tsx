"use client";

import { JobStatus } from "@prisma/client";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import { useJobStatusUpdate } from "@/components/jobs/use-job-status-update";
import { jobStatusLabels, quickJobStatusOptions } from "@/lib/job-status";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number } | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const statusUpdate = useJobStatusUpdate(job.status);

  const resolvedDensity = compact ? "small" : density ?? "large";
  const isWeekView = view === "week";
  const bottomMeta = `${job.durationMins} minutes`;
  const primaryLabel = `${job.vehicleRegistration} - ${job.customerName}`;
  const weekSecondary = job.jobTypeName;

  useEffect(() => {
    statusUpdate.setStatus(job.status);
  }, [job.status]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setMenuStyle({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!anchorRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  return (
    <article
      role="link"
      tabIndex={0}
      draggable={draggable}
      ref={anchorRef}
      onClick={() => {
        if (!isPending && !isDragging) {
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
          <button
            type="button"
            className="shrink-0 cursor-pointer rounded-full border border-[var(--surface-border)] bg-white/85 px-2 py-1 text-[11px] font-semibold text-[var(--foreground)] shadow-sm transition-colors hover:border-[var(--primary)]/25 hover:bg-white"
            onClick={(event) => {
              event.stopPropagation();
              setIsMenuOpen((current) => !current);
            }}
          >
            {jobStatusLabels[statusUpdate.status]}
          </button>
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
        <div className="mt-1 flex items-center justify-between gap-2 print:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-8 rounded-lg px-2 text-xs"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/jobs/${job.id}`);
            }}
          >
            <MaterialIcon name="open_in_new" className="text-[16px]" />
            Open
          </Button>
        </div>
      </div>
      {isMenuOpen && menuStyle
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed z-[70] w-[220px] -translate-x-1/2 rounded-3xl border border-[var(--surface-border)] bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.16)]"
              style={{
                top: menuStyle.top,
                left: menuStyle.left,
              }}
            >
              <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                Update status
              </p>
              <div className="space-y-1">
                {quickJobStatusOptions.map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    disabled={statusUpdate.pending}
                    onClick={async (event) => {
                      event.stopPropagation();
                      setIsMenuOpen(false);
                      await statusUpdate.updateStatus({
                        jobId: job.id,
                        status: statusOption,
                      });
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]/55",
                      statusUpdate.status === statusOption ? "bg-[var(--surface-muted)]/7 font-semibold" : "",
                    )}
                  >
                    <span>{jobStatusLabels[statusOption]}</span>
                    {statusUpdate.status === statusOption ? (
                      <MaterialIcon name="check" className="text-[16px]" />
                    ) : null}
                  </button>
                ))}
              </div>
              {statusUpdate.error ? (
                <p className="px-2 pb-1 pt-2 text-xs text-rose-700">{statusUpdate.error}</p>
              ) : null}
            </div>,
            document.body,
          )
        : null}
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
