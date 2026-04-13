import { NextResponse } from "next/server";
import { JobStatus } from "@prisma/client";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { JobStatusUpdateError, updateJobStatus } from "@/services/job-status-update";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const tenant = await requireCurrentWorkshop();
  const { jobId } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: JobStatus } | null;

  try {
    await updateJobStatus({
      workshopId: tenant.workshopId,
      jobId,
      status: body?.status as JobStatus,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof JobStatusUpdateError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unable to update the job status right now." },
      { status: 500 },
    );
  }
}
