import { NextResponse } from "next/server";

import { requireTenantContext } from "@/auth/tenant";

export async function GET() {
  const tenant = await requireTenantContext();

  return NextResponse.json({
    workshopId: tenant.workshopId,
    workshopSlug: tenant.workshopSlug,
  });
}
