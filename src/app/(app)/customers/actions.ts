"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { prisma } from "@/db/prisma";
import { getCurrentWorkshopId, requireCurrentWorkshop } from "@/lib/workshop";

export type CustomerActionState = {
  error: string | null;
};

const initialError = "Unable to update this customer right now.";

export async function createCustomer(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return { error: "Unable to resolve the current workshop." };
  }

  const name = formData.get("name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";

  if (!name) {
    return { error: "Customer name is required." };
  }

  if (email && !isValidEmail(email)) {
    return { error: "Customer email is invalid." };
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        workshopId,
        name,
        phone: phone || null,
        email: email || null,
      },
      select: {
        id: true,
      },
    });

    revalidatePath("/customers");
    redirect(`/customers?customerId=${customer.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { error: "Unable to create this customer right now." };
  }
}

export async function updateCustomerDetails(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return { error: "Unable to resolve the current workshop." };
  }

  const customerId = formData.get("customerId")?.toString().trim() ?? "";
  const name = formData.get("name")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const returnTo = formData.get("returnTo")?.toString().trim() || "/customers";

  if (!customerId || !name) {
    return { error: "Customer name is required." };
  }

  if (email && !isValidEmail(email)) {
    return { error: "Customer email is invalid." };
  }

  try {
    const updated = await prisma.customer.updateMany({
      where: {
        id: customerId,
        workshopId,
      },
      data: {
        name,
        phone: phone || null,
        email: email || null,
      },
    });

    if (updated.count !== 1) {
      return { error: initialError };
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { error: initialError };
  }

  revalidatePath("/customers");
  redirect(returnTo);
}

export async function removeCustomerVehicle(
  _previousState: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const workshop = await requireCurrentWorkshop();
  const workshopId = await getCurrentWorkshopId();

  if (!workshopId || workshopId !== workshop.workshopId) {
    return { error: "Unable to resolve the current workshop." };
  }

  const vehicleId = formData.get("vehicleId")?.toString().trim() ?? "";
  const customerId = formData.get("customerId")?.toString().trim() ?? "";
  const returnTo = formData.get("returnTo")?.toString().trim() || "/customers";

  if (!vehicleId || !customerId) {
    return { error: "Vehicle is required." };
  }

  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        customerId,
        workshopId,
      },
      select: {
        id: true,
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    });

    if (!vehicle) {
      return { error: "Vehicle not found." };
    }

    if (vehicle._count.jobs > 0) {
      return {
        error: "This vehicle cannot be removed because it is linked to existing jobs.",
      };
    }

    await prisma.vehicle.delete({
      where: {
        id: vehicle.id,
      },
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { error: "Unable to remove this vehicle right now." };
  }

  revalidatePath("/customers");
  redirect(returnTo);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
