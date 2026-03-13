"use server";

import { JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { getCurrentWorkshopId, requireCurrentWorkshop } from "@/lib/workshop";
import { JOB_STATUSES, getScopedJobType, resolveCustomerAndVehicle } from "@/services/job-editor";

export type JobCardActionState = {
  error: string | null;
};

export async function updateJobCard(
  _previousState: JobCardActionState,
  formData: FormData,
): Promise<JobCardActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return { error: "Unable to resolve the current workshop." };
  }

  const jobId = formData.get("jobId")?.toString().trim() ?? "";
  const registration = formData.get("registration")?.toString().trim().toUpperCase() ?? "";
  const customerName = formData.get("customerName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const make = formData.get("make")?.toString().trim() ?? "";
  const model = formData.get("model")?.toString().trim() ?? "";
  const fuel = formData.get("fuel")?.toString().trim() ?? "";
  const year = parseOptionalInt(formData.get("year"));
  const engineSizeCc = parseOptionalInt(formData.get("engineSizeCc"));
  const jobTypeId = formData.get("jobTypeId")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() as JobStatus;
  const durationMins = Number(formData.get("durationMins"));
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const scheduledDate = formData.get("scheduledDate")?.toString().trim() ?? "";
  const scheduledTime = formData.get("scheduledTime")?.toString().trim() ?? "";

  if (
    !jobId ||
    !registration ||
    !customerName ||
    !phone ||
    !jobTypeId ||
    !scheduledDate ||
    !scheduledTime
  ) {
    return {
      error:
        "Scheduled date, time, registration, customer, phone, and job type are required.",
    };
  }

  if (!JOB_STATUSES.has(status)) {
    return { error: "Status is invalid." };
  }

  if (!Number.isFinite(durationMins) || durationMins <= 0) {
    return { error: "Estimated duration must be greater than zero." };
  }

  const scheduledStart = new Date(`${scheduledDate}T${scheduledTime}:00`);

  if (Number.isNaN(scheduledStart.getTime())) {
    return { error: "Scheduled date or time is invalid." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingJob = await tx.job.findFirst({
        where: {
          id: jobId,
          workshopId,
        },
        select: {
          id: true,
        },
      });

      if (!existingJob) {
        throw new Error("Job not found.");
      }

      const jobType = await getScopedJobType(tx, workshopId, jobTypeId);
      const { customer, vehicle } = await resolveCustomerAndVehicle(tx, {
        workshopId,
        registration,
        customerName,
        phone,
        make,
        model,
        fuel,
        year,
        engineSizeCc,
      });

      await tx.job.update({
        where: {
          id: existingJob.id,
        },
        data: {
          scheduledStart,
          customerId: customer.id,
          vehicleId: vehicle.id,
          jobTypeId: jobType.id,
          status,
          durationMins,
          notes: notes || null,
        },
      });
    });
  } catch {
    return {
      error: "Unable to update the job right now.",
    };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/diary`);
  redirect(`/jobs/${jobId}`);
}

function parseOptionalInt(value: FormDataEntryValue | null) {
  const raw = value?.toString().trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}
