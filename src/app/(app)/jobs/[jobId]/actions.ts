"use server";

import { JobLineItemType, JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { buildPrimaryJobLineItem, ensurePrimaryJobLineItems } from "@/lib/job-line-items";
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
  const internalNotes = formData.get("internalNotes")?.toString().trim() ?? "";
  const technicianNotes = formData.get("technicianNotes")?.toString().trim() ?? "";
  const scheduledDate = formData.get("scheduledDate")?.toString().trim() ?? "";
  const scheduledTime = formData.get("scheduledTime")?.toString().trim() ?? "";
  const lineItems = parseLineItems(formData);

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

  if (customerEmail && !isValidEmail(customerEmail)) {
    return { error: "Customer email is invalid." };
  }

  if (!JOB_STATUSES.has(status)) {
    return { error: "Status is invalid." };
  }

  if (!Number.isFinite(durationMins) || durationMins <= 0) {
    return { error: "Estimated duration must be greater than zero." };
  }

  if (!lineItems.ok) {
    return { error: lineItems.error };
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
      const persistedLineItems = ensurePrimaryJobLineItems(lineItems.value, {
        ...buildPrimaryJobLineItem({
          jobTypeName: jobType.name,
          notes,
        }),
      });
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
          scheduledStart,
          customerId: customer.id,
          vehicleId: vehicle.id,
          jobTypeId: jobType.id,
          status,
          durationMins,
          notes: notes || null,
          internalNotes: internalNotes || null,
          technicianNotes: technicianNotes || null,
        },
      });

      await tx.jobLineItem.deleteMany({
        where: {
          jobId: existingJob.id,
          workshopId,
        },
      });

      if (persistedLineItems.length > 0) {
        await tx.jobLineItem.createMany({
          data: persistedLineItems.map((lineItem, index) => ({
            workshopId,
            jobId: existingJob.id,
            description: lineItem.description,
            itemType: lineItem.itemType,
            quantity: lineItem.quantity,
            unitPrice: lineItem.unitPrice,
            position: index,
          })),
        });
      }
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const JOB_LINE_ITEM_TYPES = new Set<JobLineItemType>(["LABOUR", "PART", "MISC"]);

function parseLineItems(formData: FormData):
  | {
      ok: true;
      value: Array<{
        description: string;
        itemType: JobLineItemType;
        quantity: number;
        unitPrice: number;
      }>;
    }
  | { ok: false; error: string } {
  const descriptions = formData.getAll("lineItemDescription");
  const itemTypes = formData.getAll("lineItemType");
  const quantities = formData.getAll("lineItemQuantity");
  const unitPrices = formData.getAll("lineItemUnitPrice");
  const rowCount = Math.max(
    descriptions.length,
    itemTypes.length,
    quantities.length,
    unitPrices.length,
  );
  const lineItems: Array<{
    description: string;
    itemType: JobLineItemType;
    quantity: number;
    unitPrice: number;
  }> = [];

  for (let index = 0; index < rowCount; index += 1) {
    const description = descriptions[index]?.toString().trim() ?? "";
    const itemTypeRaw = itemTypes[index]?.toString().trim() ?? "LABOUR";
    const quantityValue = quantities[index]?.toString().trim() ?? "";
    const unitPriceValue = unitPrices[index]?.toString().trim() ?? "";
    const hasAnyValue = Boolean(description || quantityValue || unitPriceValue);

    const quantityRaw = quantityValue || "1";
    const unitPriceRaw = unitPriceValue || "0";

    if (!hasAnyValue) {
      continue;
    }

    if (!description) {
      return { ok: false, error: "Each line item needs a description." };
    }

    if (!JOB_LINE_ITEM_TYPES.has(itemTypeRaw as JobLineItemType)) {
      return { ok: false, error: "One of the line item types is invalid." };
    }

    const quantity = Number(quantityRaw);
    const unitPrice = Number(unitPriceRaw);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { ok: false, error: "Each line item quantity must be greater than zero." };
    }

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return { ok: false, error: "Each line item unit price must be zero or greater." };
    }

    lineItems.push({
      description,
      itemType: itemTypeRaw as JobLineItemType,
      quantity: roundCurrencyInput(quantity),
      unitPrice: roundCurrencyInput(unitPrice),
    });
  }

  return { ok: true, value: lineItems };
}

function roundCurrencyInput(value: number) {
  return Math.round(value * 100) / 100;
}
