import { NextResponse } from "next/server";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { DvlaLookupError, lookupVehicleByRegistration } from "@/services/dvla";

export async function POST(request: Request) {
  await requireCurrentWorkshop();

  const body = (await request.json().catch(() => null)) as
    | { registration?: string }
    | null;

  const registration = body?.registration?.trim() ?? "";

  try {
    const vehicle = await lookupVehicleByRegistration(registration);
    return NextResponse.json({ vehicle });
  } catch (error) {
    if (error instanceof DvlaLookupError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unable to complete DVLA lookup right now." },
      { status: 500 },
    );
  }
}
