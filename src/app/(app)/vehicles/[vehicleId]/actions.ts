"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { getCurrentWorkshopId, requireCurrentWorkshop } from "@/lib/workshop";

export type VehicleActionState = {
  error: string | null;
};

const initialError = "Unable to save this vehicle right now.";

export async function saveVehicleDetails(
  _previousState: VehicleActionState,
  formData: FormData,
): Promise<VehicleActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return { error: "Unable to resolve the current workshop." };
  }

  const vehicleId = formData.get("vehicleId")?.toString().trim() ?? "";
  const customerId = formData.get("customerId")?.toString().trim() ?? "";
  const returnTo = formData.get("returnTo")?.toString().trim() || "/customers";
  const registration = formData.get("registration")?.toString().trim().toUpperCase() ?? "";
  const make = formData.get("make")?.toString().trim() ?? "";
  const model = formData.get("model")?.toString().trim() ?? "";
  const fuel = formData.get("fuel")?.toString().trim() ?? "";
  const year = parseOptionalInt(formData.get("year"));
  const engineSizeCc = parseOptionalInt(formData.get("engineSizeCc"));

  if (!customerId || !registration) {
    return { error: "Registration is required." };
  }

  const duplicateWhere =
    vehicleId && vehicleId !== "new"
      ? {
          workshopId,
          registration,
          NOT: { id: vehicleId },
        }
      : {
          workshopId,
          registration,
        };

  const duplicate = await prisma.vehicle.findFirst({
    where: duplicateWhere,
    select: { id: true },
  });

  if (duplicate) {
    return { error: "A vehicle with this registration already exists in this workshop." };
  }

  try {
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        workshopId,
      },
      select: { id: true },
    });

    if (!customer) {
      return { error: "Customer not found." };
    }

    if (vehicleId && vehicleId !== "new") {
      const updated = await prisma.vehicle.updateMany({
        where: {
          id: vehicleId,
          workshopId,
          customerId,
        },
        data: {
          registration,
          make: make || null,
          model: model || null,
          fuel: fuel || null,
          year,
          engineSizeCc,
          engine: engineSizeCc != null ? `${engineSizeCc}cc` : null,
        },
      });

      if (updated.count !== 1) {
        return { error: initialError };
      }
    } else {
      await prisma.vehicle.create({
        data: {
          workshopId,
          customerId,
          registration,
          make: make || null,
          model: model || null,
          fuel: fuel || null,
          year,
          engineSizeCc,
          engine: engineSizeCc != null ? `${engineSizeCc}cc` : null,
        },
      });
    }
  } catch {
    return { error: initialError };
  }

  revalidatePath("/customers");
  redirect(returnTo);
}

function parseOptionalInt(value: FormDataEntryValue | null) {
  const raw = value?.toString().trim();

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}
