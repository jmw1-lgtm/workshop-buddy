import { formatVehicleField, isValidUkRegistration, normalizeRegistration } from "@/lib/vehicle";

type DvlaVehicleResponse = {
  registrationNumber: string;
  make?: string;
  fuelType?: string;
  yearOfManufacture?: number;
  engineCapacity?: number;
};

export type VehicleLookupResult = {
  registration: string;
  make: string;
  model: string;
  fuel: string;
  year: number | null;
  engineSizeCc: number | null;
};

export class DvlaLookupError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "DvlaLookupError";
    this.status = status;
  }
}

export async function lookupVehicleByRegistration(
  registrationInput: string,
): Promise<VehicleLookupResult> {
  const registration = normalizeRegistration(registrationInput);

  if (!isValidUkRegistration(registration)) {
    throw new DvlaLookupError("Invalid registration format.", 400);
  }

  if (!process.env.DVLA_API_KEY) {
    throw new DvlaLookupError("DVLA lookup is not configured.", 500);
  }

  const baseUrl =
    process.env.DVLA_API_BASE_URL ??
    "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry";

  const response = await fetch(`${baseUrl}/v1/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": process.env.DVLA_API_KEY,
      "X-Correlation-Id": crypto.randomUUID(),
    },
    body: JSON.stringify({
      registrationNumber: registration,
    }),
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new DvlaLookupError("Registration not found.", 404);
  }

  if (response.status === 400) {
    const body = (await safeJson(response)) as
      | { errors?: Array<{ detail?: string; title?: string }> }
      | undefined;
    const message =
      body?.errors?.[0]?.detail ?? body?.errors?.[0]?.title ?? "Invalid registration format.";
    throw new DvlaLookupError(message, 400);
  }

  if (!response.ok) {
    throw new DvlaLookupError("DVLA service is unavailable right now.", response.status);
  }

  const vehicle = (await response.json()) as DvlaVehicleResponse;

  return {
    registration: vehicle.registrationNumber,
    make: formatVehicleField(vehicle.make),
    model: "",
    fuel: formatVehicleField(vehicle.fuelType),
    year: vehicle.yearOfManufacture ?? null,
    engineSizeCc: vehicle.engineCapacity ?? null,
  };
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}
