import { NextResponse } from "next/server";

import { requireCurrentWorkshop } from "@/lib/workshop";

export async function GET() {
  const tenant = await requireCurrentWorkshop();

  return NextResponse.json({
    workshopId: tenant.workshopId,
    workshopName: tenant.workshopName,
    workshopSlug: tenant.workshopSlug,
  });
}
