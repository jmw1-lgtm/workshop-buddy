"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

type DragJob = {
  id: string;
  slotSpan: number;
};

export function useDiaryReschedule() {
  const router = useRouter();
  const [dragJob, setDragJob] = useState<DragJob | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function moveJob(input: { jobId: string; scheduledStart: string }) {
    setPendingJobId(input.jobId);
    setError(null);

    try {
      const response = await fetch(`/api/diary/jobs/${input.jobId}/schedule`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduledStart: input.scheduledStart,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to move the job right now.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (moveError) {
      setError(
        moveError instanceof Error ? moveError.message : "Unable to move the job right now.",
      );
    } finally {
      setPendingJobId(null);
      setDragOverKey(null);
      setDragJob(null);
    }
  }

  function startDragging(job: DragJob) {
    setError(null);
    setDragJob(job);
  }

  function endDragging() {
    setDragOverKey(null);
    setDragJob(null);
  }

  function canDropOnSlot(slotIndex: number, totalSlots: number) {
    if (!dragJob) {
      return false;
    }

    return slotIndex + dragJob.slotSpan <= totalSlots;
  }

  return {
    dragJob,
    dragOverKey,
    pendingJobId,
    error,
    moveJob,
    startDragging,
    endDragging,
    setDragOverKey,
    canDropOnSlot,
  };
}
