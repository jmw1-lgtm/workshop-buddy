"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { CreateJobDialog } from "@/components/diary/create-job-dialog";
import { DiaryJobCard } from "@/components/diary/diary-job-card";
import { useDiaryReschedule } from "@/components/diary/use-diary-reschedule";
import { MaterialIcon } from "@/components/layout/material-icon";
import { cn } from "@/lib/utils";

type WeekDiaryGridProps = {
  slotLength: 30 | 60;
  slots: Array<{
    index: number;
    label: string;
    dateTimeValue: string;
  }>;
  days: Array<{
    dateParam: string;
    label: string;
    shortLabel: string;
    isToday: boolean;
    isSelected: boolean;
  }>;
  jobTypes: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  jobs: Array<{
    id: string;
    customerName: string;
    customerPhone: string | null;
    vehicleRegistration: string;
    jobTypeId: string;
    jobTypeName: string;
    jobTypeColor: string;
    status:
      | "BOOKED"
      | "ARRIVED"
      | "IN_PROGRESS"
      | "WAITING_PARTS"
      | "WAITING_COLLECTION"
      | "COMPLETED"
      | "CANCELLED";
    durationMins: number;
    notes: string | null;
    slotIndex: number;
    slotSpan: number;
    dayIndex: number;
  }>;
};

const SLOT_HEIGHT = 76;

export function WeekDiaryGrid({
  slotLength,
  slots,
  days,
  jobTypes,
  jobs,
}: WeekDiaryGridProps) {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    dateTimeValue: string;
    label: string;
    selectedDate: string;
  } | null>(null);
  const reschedule = useDiaryReschedule();

  const slotStyle = useMemo(
    () => ({
      gridTemplateRows: `repeat(${slots.length}, minmax(${SLOT_HEIGHT}px, ${SLOT_HEIGHT}px))`,
    }),
    [slots.length],
  );

  return (
    <>
      <div className="overflow-x-auto">
        <div className="min-w-[1120px] overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-white shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-[88px_repeat(7,minmax(148px,1fr))] border-b border-[color:rgba(214,222,232,0.75)] bg-[var(--surface-muted)]/60">
            <div className="border-r border-[color:rgba(214,222,232,0.75)] px-3 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Time
            </div>
            {days.map((day) => (
              <div
                key={day.dateParam}
                className={cn(
                  "border-r border-[color:rgba(214,222,232,0.75)] px-4 py-4 last:border-r-0",
                  day.isSelected ? "bg-white/60" : "",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold leading-none text-[var(--foreground)]">
                      {day.shortLabel}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-none text-[var(--muted-foreground)]">
                      {day.label}
                    </p>
                  </div>
                  {day.isToday ? (
                    <span className="rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--primary)]">
                      Today
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[88px_repeat(7,minmax(148px,1fr))]">
            <div className="border-r border-[color:rgba(214,222,232,0.78)] bg-[#e3e9f0]">
              <div className="grid" style={slotStyle}>
                {slots.map((slot) => (
                  <div
                    key={slot.dateTimeValue}
                    className="border-b border-[color:rgba(214,222,232,0.72)] px-3 pt-3 text-right text-xs font-semibold text-[var(--muted-foreground)]"
                  >
                    {slot.label}
                  </div>
                ))}
              </div>
            </div>

            {days.map((day, dayIndex) => {
              const dayJobs = jobs.filter((job) => job.dayIndex === dayIndex);
              const clusters = buildWeekClusters(dayJobs);

              return (
                <div
                  key={day.dateParam}
                  className="relative min-w-0 overflow-hidden border-r border-[color:rgba(214,222,232,0.72)] last:border-r-0"
                >
                  <div className="grid" style={slotStyle}>
                    {slots.map((slot) => {
                      const slotStart = new Date(slot.dateTimeValue);
                      const selectedStart = new Date(
                        day.dateParam === slot.dateTimeValue.slice(0, 10)
                          ? slot.dateTimeValue
                          : `${day.dateParam}T${slotStart.toTimeString().slice(0, 8)}`,
                      );

                      const slotKey = `${day.dateParam}-${slot.label}`;
                      const canDrop = reschedule.canDropOnSlot(slot.index, slots.length);
                      const isDropTarget = reschedule.dragOverKey === slotKey;

                      return (
                        <button
                          key={`${day.dateParam}-${slot.dateTimeValue}`}
                          type="button"
                          onClick={() => {
                            if (reschedule.dragJob) {
                              return;
                            }

                            setSelectedSlot({
                              dateTimeValue: selectedStart.toISOString(),
                              label: `${day.shortLabel} ${slot.label}`,
                              selectedDate: day.dateParam,
                            });
                            setOpen(true);
                          }}
                          onDragOver={(event) => {
                            if (!canDrop) {
                              return;
                            }

                            event.preventDefault();
                            reschedule.setDragOverKey(slotKey);
                          }}
                          onDragLeave={() => {
                            if (isDropTarget) {
                              reschedule.setDragOverKey(null);
                            }
                          }}
                          onDrop={(event) => {
                            event.preventDefault();

                            if (!canDrop || !reschedule.dragJob) {
                              return;
                            }

                            void reschedule.moveJob({
                              jobId: reschedule.dragJob.id,
                              scheduledStart: selectedStart.toISOString(),
                            });
                          }}
                          className={cn(
                            "border-b border-[color:rgba(214,222,232,0.68)] px-3 text-left transition-colors hover:bg-[var(--surface-muted)]/45",
                            canDrop ? "cursor-copy" : "",
                            isDropTarget
                              ? "bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]/30"
                              : "",
                          )}
                        >
                          <span className="sr-only">Create job on {day.label} at {slot.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pointer-events-none absolute inset-0 grid overflow-hidden" style={slotStyle}>
                    {clusters.map((cluster) =>
                      cluster.jobs.length === 1 ? (
                        <div
                          key={cluster.jobs[0].id}
                          className="pointer-events-auto min-h-0 min-w-0 px-2.5 py-1.5"
                          style={{
                            gridRow: `${cluster.slotIndex + 1} / span ${cluster.slotSpan}`,
                          }}
                        >
                          <DiaryJobCard
                            job={cluster.jobs[0]}
                            view="week"
                            density={
                              cluster.jobs[0].slotSpan <= 1
                                ? "small"
                                : cluster.jobs[0].slotSpan === 2
                                  ? "medium"
                                  : "large"
                            }
                            draggable
                            isPending={reschedule.pendingJobId === cluster.jobs[0].id}
                            onDragStart={() =>
                              reschedule.startDragging({
                                id: cluster.jobs[0].id,
                                slotSpan: cluster.jobs[0].slotSpan,
                              })
                            }
                            onDragEnd={() => {
                              reschedule.endDragging();
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          key={`${day.dateParam}-${cluster.slotIndex}-${cluster.slotSpan}`}
                          className="pointer-events-auto min-h-0 min-w-0 px-2.5 py-1.5"
                          style={{
                            gridRow: `${cluster.slotIndex + 1} / span ${cluster.slotSpan}`,
                          }}
                        >
                          <WeekOverlapCluster
                            dayDateParam={day.dateParam}
                            jobs={cluster.jobs}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[var(--surface-border)] bg-[var(--surface-muted)]/60 px-4 py-3 text-sm text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <MaterialIcon name="info" className="text-[18px]" />
              Drag jobs to reschedule them. Clicking still opens the job card. Empty slots create a new job for that day and time.
            </div>
          </div>
          {reschedule.error ? (
            <div className="border-t border-[var(--surface-border)] bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {reschedule.error}
            </div>
          ) : null}
        </div>
      </div>

      <CreateJobDialog
        open={open}
        onOpenChange={setOpen}
        scheduledStart={selectedSlot?.dateTimeValue ?? null}
        slotLabel={selectedSlot?.label ?? null}
        selectedDate={selectedSlot?.selectedDate ?? days[0]?.dateParam ?? ""}
        selectedView="week"
        jobTypes={jobTypes}
        slotLength={slotLength}
        job={null}
      />
    </>
  );
}

type WeekJob = WeekDiaryGridProps["jobs"][number];

type WeekCluster = {
  slotIndex: number;
  slotSpan: number;
  jobs: WeekJob[];
};

function buildWeekClusters(dayJobs: WeekJob[]): WeekCluster[] {
  const sortedJobs = [...dayJobs].sort((left, right) => left.slotIndex - right.slotIndex);
  const clusters: WeekCluster[] = [];

  for (const job of sortedJobs) {
    const jobEnd = job.slotIndex + job.slotSpan;
    const currentCluster = clusters.at(-1);

    if (!currentCluster) {
      clusters.push({
        slotIndex: job.slotIndex,
        slotSpan: job.slotSpan,
        jobs: [job],
      });
      continue;
    }

    const currentEnd = currentCluster.slotIndex + currentCluster.slotSpan;

    if (job.slotIndex < currentEnd) {
      currentCluster.jobs.push(job);
      currentCluster.slotSpan = Math.max(currentEnd, jobEnd) - currentCluster.slotIndex;
      continue;
    }

    clusters.push({
      slotIndex: job.slotIndex,
      slotSpan: job.slotSpan,
      jobs: [job],
    });
  }

  return clusters;
}

function WeekOverlapCluster({
  dayDateParam,
  jobs,
}: {
  dayDateParam: string;
  jobs: WeekJob[];
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setPopoverStyle({
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
  }, [isOpen]);

  return (
    <div
      ref={anchorRef}
      className="group relative h-full w-full min-w-0"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <Link
        href={`/diary?view=day&date=${dayDateParam}`}
        className="flex h-full w-full min-w-0 items-center justify-center rounded-3xl border border-[var(--primary)]/20 bg-[linear-gradient(145deg,rgba(15,118,110,0.16),rgba(15,118,110,0.09)_52%,rgba(255,255,255,0.72))] px-3 py-3 text-center shadow-[0_16px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-px hover:border-[var(--primary)]/36 hover:shadow-[0_20px_34px_rgba(15,23,42,0.14)]"
      >
        <div className="flex min-w-0 flex-col items-center justify-center gap-2">
          <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-white/70 bg-white/78 text-[var(--primary)] shadow-[0_8px_16px_rgba(15,23,42,0.08)]">
            <MaterialIcon name="event_busy" className="text-[18px]" />
          </div>
          <p className="text-[2rem] font-semibold leading-none tracking-tight text-[var(--foreground)]">
            {jobs.length}
          </p>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-[var(--muted-foreground)]">
              {jobs.length === 1 ? "booking" : "bookings"}
            </p>
            <p className="text-[11px] font-medium text-[var(--primary)]">
              View day details
            </p>
          </div>
        </div>
      </Link>

      {isOpen && popoverStyle
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[60] w-[min(340px,calc(100vw-24px))] -translate-x-1/2"
              style={{
                top: popoverStyle.top,
                left: popoverStyle.left,
              }}
            >
              <div className="rounded-3xl border border-[var(--surface-border)] bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
                <p className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Overlapping bookings
                </p>
                <div className="mt-2 space-y-2">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)]/55 px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">
                          {job.vehicleRegistration}
                        </p>
                        <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[var(--muted-foreground)]">
                          {job.status === "BOOKED" ? "Scheduled" : formatStatus(job.status)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-[var(--foreground)]">
                        {job.customerName}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        {job.jobTypeName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function formatStatus(status: WeekJob["status"]) {
  switch (status) {
    case "ARRIVED":
      return "Arrived";
    case "IN_PROGRESS":
      return "In Progress";
    case "WAITING_PARTS":
      return "Waiting Parts";
    case "WAITING_COLLECTION":
      return "Waiting Collection";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "BOOKED":
    default:
      return "Scheduled";
  }
}
