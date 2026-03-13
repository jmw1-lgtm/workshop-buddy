"use client";

import Link from "next/link";
import { useState } from "react";

import { CreateJobDialog } from "@/components/diary/create-job-dialog";
import { MaterialIcon } from "@/components/layout/material-icon";
import { Button } from "@/components/ui/button";
import { formatShortDisplayDate, formatTimeLabel } from "@/lib/dates";
import { cn } from "@/lib/utils";

type JobTypeOption = {
  id: string;
  name: string;
  color: string;
};

type DashboardSlot = {
  startsAt: string;
  endsAt: string;
  dateParam: string;
};

type NextAvailableSlotsProps = {
  slots: DashboardSlot[];
  slotLength: 30 | 60;
  jobTypes: JobTypeOption[];
};

export function NextAvailableSlots({
  slots,
  slotLength,
  jobTypes,
}: NextAvailableSlotsProps) {
  const [selectedSlot, setSelectedSlot] = useState<DashboardSlot | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {slots.map((slot) => {
            const startsAt = new Date(slot.startsAt);
            const endsAt = new Date(slot.endsAt);

            return (
              <button
                key={slot.startsAt}
                type="button"
                onClick={() => {
                  setSelectedSlot(slot);
                }}
                className={cn(
                  "group rounded-3xl border border-[var(--surface-border)] bg-white/80 p-4 text-left transition-colors hover:border-[var(--primary)]/35 hover:bg-white hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[2.35rem] leading-none font-semibold tracking-tight text-[var(--foreground)]">
                      {formatTimeLabel(startsAt)}
                    </p>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {formatShortDisplayDate(startsAt)} · until {formatTimeLabel(endsAt)}
                    </p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--primary)]">
                    <MaterialIcon name="add_task" className="text-[20px]" />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-3 py-1.5 transition-colors group-hover:bg-[var(--primary)]/10">
                    <MaterialIcon name="add" className="text-[18px]" />
                    Create booking
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm text-[var(--muted-foreground)]">
            <span className="font-semibold text-[var(--foreground)]">{slotLength} min</span>{" "}
            booking window
          </div>
          <Button asChild>
            <Link href={`/diary?date=${slots[0]?.dateParam ?? ""}`}>Open diary</Link>
          </Button>
        </div>
      </div>

      <CreateJobDialog
        open={selectedSlot !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSlot(null);
          }
        }}
        scheduledStart={selectedSlot?.startsAt ?? null}
        slotLabel={
          selectedSlot
            ? `${formatShortDisplayDate(new Date(selectedSlot.startsAt))} ${formatTimeLabel(new Date(selectedSlot.startsAt))}`
            : null
        }
        selectedDate={selectedSlot?.dateParam ?? ""}
        selectedView="day"
        jobTypes={jobTypes}
        slotLength={slotLength}
        job={null}
      />
    </>
  );
}
