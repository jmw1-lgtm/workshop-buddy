"use server";

import { JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { getCurrentWorkshopId, requireCurrentWorkshop } from "@/lib/workshop";
import {
  JOB_STATUSES,
  allocateWorkshopJobNumber,
  getScopedJobType,
  resolveCustomerAndVehicle,
} from "@/services/job-editor";

export type JobActionState = {
  error: string | null;
};

export async function createDiaryJob(
  _previousState: JobActionState,
  formData: FormData,
): Promise<JobActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return {
      error: "Unable to resolve the current workshop.",
    };
  }

  const registration = formData.get("registration")?.toString().trim().toUpperCase() ?? "";
  const customerName = formData.get("customerName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const customerEmail = formData.get("customerEmail")?.toString().trim() ?? "";
  const make = formData.get("make")?.toString().trim() ?? "";
  const model = formData.get("model")?.toString().trim() ?? "";
  const fuel = formData.get("fuel")?.toString().trim() ?? "";
  const year = parseOptionalInt(formData.get("year"));
  const engineSizeCc = parseOptionalInt(formData.get("engineSizeCc"));
  const jobTypeId = formData.get("jobTypeId")?.toString().trim() ?? "";
  const durationMins = Number(formData.get("durationMins"));
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const scheduledStartRaw = formData.get("scheduledStart")?.toString() ?? "";
  const selectedDateParam = formData.get("selectedDate")?.toString() ?? "";
  const selectedView = formData.get("selectedView")?.toString() === "week" ? "week" : "day";

  if (!registration || !customerName || !jobTypeId || !scheduledStartRaw) {
    return {
      error: "Registration, customer, job type, and slot are required.",
    };
  }

  if (customerEmail && !isValidEmail(customerEmail)) {
    return {
      error: "Customer email is invalid.",
    };
  }

  if (!Number.isFinite(durationMins) || durationMins <= 0) {
    return {
      error: "Estimated duration must be greater than zero.",
    };
  }

  const scheduledStart = new Date(scheduledStartRaw);

  if (Number.isNaN(scheduledStart.getTime())) {
    return {
      error: "Selected slot is invalid.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const jobType = await getScopedJobType(tx, workshopId, jobTypeId);
      const jobNumber = await allocateWorkshopJobNumber(tx, workshopId);
      const { customer, vehicle } = await resolveCustomerAndVehicle(tx, {
        workshopId,
        registration,
        customerName,
        phone,
        email: customerEmail,
        make,
        model,
        fuel,
        year,
        engineSizeCc,
      });

      await tx.job.create({
        data: {
          workshopId,
          jobNumber,
          customerId: customer.id,
          vehicleId: vehicle.id,
          jobTypeId: jobType.id,
          status: "BOOKED",
          scheduledStart,
          durationMins,
          notes: notes || null,
        },
      });
    });
  } catch {
    return {
      error: "Unable to create the job right now.",
    };
  }

  const dateParam = selectedDateParam || toDateParamFromIso(scheduledStart.toISOString());
  revalidatePath(`/diary?date=${dateParam}`);
  redirect(buildDiaryRedirect(dateParam, selectedView));
}

export async function updateDiaryJob(
  _previousState: JobActionState,
  formData: FormData,
): Promise<JobActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return {
      error: "Unable to resolve the current workshop.",
    };
  }

  const jobId = formData.get("jobId")?.toString().trim() ?? "";
  const registration = formData.get("registration")?.toString().trim().toUpperCase() ?? "";
  const customerName = formData.get("customerName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const customerEmail = formData.get("customerEmail")?.toString().trim() ?? "";
  const make = formData.get("make")?.toString().trim() ?? "";
  const model = formData.get("model")?.toString().trim() ?? "";
  const fuel = formData.get("fuel")?.toString().trim() ?? "";
  const year = parseOptionalInt(formData.get("year"));
  const engineSizeCc = parseOptionalInt(formData.get("engineSizeCc"));
  const jobTypeId = formData.get("jobTypeId")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString().trim() as JobStatus;
  const durationMins = Number(formData.get("durationMins"));
  const notes = formData.get("notes")?.toString().trim() ?? "";
  const selectedDateParam = formData.get("selectedDate")?.toString() ?? "";
  const selectedView = formData.get("selectedView")?.toString() === "week" ? "week" : "day";

  if (!jobId || !registration || !customerName || !jobTypeId) {
    return {
      error: "Registration, customer, and job type are required.",
    };
  }

  if (customerEmail && !isValidEmail(customerEmail)) {
    return {
      error: "Customer email is invalid.",
    };
  }

  if (!JOB_STATUSES.has(status)) {
    return {
      error: "Status is invalid.",
    };
  }

  if (!Number.isFinite(durationMins) || durationMins <= 0) {
    return {
      error: "Estimated duration must be greater than zero.",
    };
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
          scheduledStart: true,
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
        email: customerEmail,
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

  revalidatePath(`/diary?date=${selectedDateParam}`);
  redirect(buildDiaryRedirect(selectedDateParam, selectedView));
}

export async function deleteDiaryJob(
  _previousState: JobActionState,
  formData: FormData,
): Promise<JobActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return {
      error: "Unable to resolve the current workshop.",
    };
  }

  const jobId = formData.get("jobId")?.toString().trim() ?? "";
  const selectedDateParam = formData.get("selectedDate")?.toString() ?? "";
  const selectedView = formData.get("selectedView")?.toString() === "week" ? "week" : "day";

  if (!jobId) {
    return {
      error: "Job is required.",
    };
  }

  try {
    const deleted = await prisma.job.deleteMany({
      where: {
        id: jobId,
        workshopId,
      },
    });

    if (deleted.count !== 1) {
      throw new Error("Job not found.");
    }
  } catch {
    return {
      error: "Unable to delete the job right now.",
    };
  }

  revalidatePath(`/diary?date=${selectedDateParam}`);
  redirect(buildDiaryRedirect(selectedDateParam, selectedView));
}

function toDateParamFromIso(iso: string) {
  return iso.slice(0, 10);
}

function buildDiaryRedirect(dateParam: string, view: "day" | "week") {
  return `/diary?date=${dateParam}&view=${view}`;
}

function parseOptionalInt(value: FormDataEntryValue | null) {
  const raw = value?.toString().trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
