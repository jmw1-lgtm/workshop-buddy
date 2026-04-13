"use client";

import { JobStatus } from "@prisma/client";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function useJobStatusUpdate(initialStatus: JobStatus) {
  const router = useRouter();
  const [status, setStatus] = useState<JobStatus>(initialStatus);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(input: { jobId: string; status: JobStatus }) {
    const previousStatus = status;

    setStatus(input.status);
    setPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/jobs/${input.jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: input.status,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to update the job status right now.");
      }

      startTransition(() => {
        router.refresh();
      });
      return true;
    } catch (updateError) {
      setStatus(previousStatus);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update the job status right now.",
      );
      return false;
    } finally {
      setPending(false);
    }
  }

  return {
    status,
    pending,
    error,
    setStatus,
    setError,
    updateStatus,
  };
}
