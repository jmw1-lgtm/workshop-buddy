"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CreateJobDialog } from "@/components/diary/create-job-dialog";
import { DiaryJobCard } from "@/components/diary/diary-job-card";
import { useDiaryReschedule } from "@/components/diary/use-diary-reschedule";
import { MaterialIcon } from "@/components/layout/material-icon";
import { cn } from "@/lib/utils";

type DiaryGridProps = {
  slotLength: 30 | 60;
  selectedDate: string;
  slots: Array<{
    index: number;
    label: string;
    dateTimeValue: string;
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
    customerEmail: string | null;
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
  }>;
};

const SLOT_HEIGHT = 76;

export function DiaryGrid({
  slotLength,
  selectedDate,
  slots,
  jobTypes,
  jobs,
}: DiaryGridProps) {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    dateTimeValue: string;
    label: string;
  } | null>(null);
  const reschedule = useDiaryReschedule();

  const slotStyle = useMemo(
    () => ({
      gridTemplateRows: `repeat(${slots.length}, minmax(${SLOT_HEIGHT}px, ${SLOT_HEIGHT}px))`,
    }),
    [slots.length],
  );

  useEffect(() => {
    const tick = () => {
      setNow(new Date());
    };

    tick();

    const delayUntilNextMinute = 60_000 - (Date.now() % 60_000);
    const timeoutId = window.setTimeout(() => {
      intervalRef.current = window.setInterval(tick, 60_000);
    }, delayUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);

      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const currentTimeLine = useMemo(() => {
    if (!now || slots.length === 0) {
      return null;
    }

    const todayDateParam = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;

    if (selectedDate !== todayDateParam) {
      return null;
    }

    const firstSlot = new Date(slots[0].dateTimeValue);
    const lastSlot = new Date(slots[slots.length - 1].dateTimeValue);
    const rangeStart = firstSlot.getTime();
    const rangeEnd = lastSlot.getTime() + slotLength * 60_000;
    const currentTime = now.getTime();

    if (currentTime < rangeStart || currentTime > rangeEnd) {
      return null;
    }

    const minutesFromStart = (currentTime - rangeStart) / 60_000;

    return {
      top: (minutesFromStart / slotLength) * SLOT_HEIGHT,
      label: new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(now),
    };
  }, [now, selectedDate, slotLength, slots]);

  return (
    <>
      <div className="overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-white shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
        <div className="grid grid-cols-[88px_1fr] border-b border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(233,237,242,0.96),rgba(233,237,242,0.72))] px-4 py-4">
          <div className="flex items-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Time
          </div>
          <div className="flex items-center justify-between gap-4 pl-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">Day schedule</p>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-[88px_1fr]">
          <div className="border-r border-[var(--surface-border)] bg-[#dde5ee]">
            <div className="grid" style={slotStyle}>
              {slots.map((slot) => (
                <div
                  key={slot.dateTimeValue}
                  className="border-b border-[var(--surface-border)] px-3 pt-3 text-right text-xs font-semibold text-[var(--muted-foreground)]"
                >
                  {slot.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid" style={slotStyle}>
              {slots.map((slot) => {
                const canDrop = reschedule.canDropOnSlot(slot.index, slots.length);
                const isDropTarget = reschedule.dragOverKey === slot.dateTimeValue;

                return (
                  <button
                    key={slot.dateTimeValue}
                    type="button"
                    onClick={() => {
                      if (reschedule.dragJob) {
                        return;
                      }

                      setSelectedSlot({
                        dateTimeValue: slot.dateTimeValue,
                        label: slot.label,
                      });
                      setOpen(true);
                    }}
                    onDragOver={(event) => {
                      if (!canDrop) {
                        return;
                      }

                      event.preventDefault();
                      reschedule.setDragOverKey(slot.dateTimeValue);
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
                        scheduledStart: slot.dateTimeValue,
                      });
                    }}
                    className={cn(
                      "border-b border-[var(--surface-border)] px-4 text-left transition-colors hover:bg-[var(--surface-muted)]/50",
                      canDrop ? "cursor-copy" : "",
                      isDropTarget ? "bg-[var(--primary)]/10 ring-1 ring-inset ring-[var(--primary)]/30" : "",
                    )}
                  >
                    <span className="sr-only">Create job at {slot.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              className="pointer-events-none absolute inset-0 grid"
              style={slotStyle}
            >
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="pointer-events-auto min-h-0 px-1.5 py-px"
                  style={{
                    gridRow: `${job.slotIndex + 1} / span ${job.slotSpan}`,
                  }}
                >
                  <DiaryJobCard
                    job={job}
                    density={
                      job.slotSpan <= 1 ? "small" : job.slotSpan === 2 ? "medium" : "large"
                    }
                    draggable
                    isPending={reschedule.pendingJobId === job.id}
                    onDragStart={() =>
                      reschedule.startDragging({
                        id: job.id,
                        slotSpan: job.slotSpan,
                      })
                    }
                    onDragEnd={() => {
                      reschedule.endDragging();
                    }}
                  />
                </div>
              ))}
            </div>

            {currentTimeLine ? (
              <div
                className="pointer-events-none absolute inset-x-0 z-40"
                style={{ top: `${currentTimeLine.top}px` }}
              >
                <div className="relative h-0">
                  <div className="absolute inset-x-0 -translate-y-1/2">
                    <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-[linear-gradient(90deg,rgba(15,118,110,0.12),rgba(15,118,110,0.02))]" />
                    <div className="relative h-[2px] w-full bg-[var(--primary-strong)]" />
                    <div className="absolute left-0 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--primary-strong)] shadow-[0_0_0_3px_rgba(15,118,110,0.22)]" />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {currentTimeLine ? (
            <div
              className="pointer-events-none absolute left-0 z-40 w-[88px]"
              style={{ top: `${currentTimeLine.top}px` }}
            >
              <div className="relative h-0">
                <div className="absolute left-0 flex w-[88px] -translate-y-1/2 items-center justify-end gap-2 pr-3">
                  <span className="rounded-full border border-[var(--primary)]/15 bg-white px-2 py-1 text-[11px] font-semibold text-[var(--primary-strong)] shadow-sm">
                    {currentTimeLine.label}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="border-t border-[var(--surface-border)] bg-[var(--surface-muted)]/60 px-4 py-3 text-sm text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2">
            <MaterialIcon name="info" className="text-[18px]" />
            Drag jobs to reschedule them. Clicking still opens the job card. Empty
            slots create a new job for that day and time.
          </div>
        </div>
        {reschedule.error ? (
          <div className="border-t border-[var(--surface-border)] bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {reschedule.error}
          </div>
        ) : null}
      </div>

      <CreateJobDialog
        open={open}
        onOpenChange={setOpen}
        scheduledStart={selectedSlot?.dateTimeValue ?? null}
        slotLabel={selectedSlot?.label ?? null}
        selectedDate={selectedDate}
        selectedView="day"
        jobTypes={jobTypes}
        slotLength={slotLength}
        job={null}
      />
    </>
  );
}
