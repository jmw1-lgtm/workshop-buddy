import { NextResponse } from "next/server";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { getJobIntakeMatches } from "@/services/job-intake";

export async function GET(request: Request) {
  const workshop = await requireCurrentWorkshop();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  const results = await getJobIntakeMatches({
    workshopId: workshop.workshopId,
    query,
  });

  return NextResponse.json({ results });
}
