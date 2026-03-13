import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { requireCurrentWorkshop } from "@/lib/workshop";
import { DiaryScheduleError, rescheduleDiaryJob } from "@/services/diary-schedule";

type RouteContext = {
  params: Promise<{
    jobId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const tenant = await requireCurrentWorkshop();
  const { jobId } = await context.params;
  const body = (await request.json().catch(() => null)) as
    | { scheduledStart?: string }
    | null;

  try {
    await rescheduleDiaryJob({
      workshopId: tenant.workshopId,
      jobId,
      scheduledStart: new Date(body?.scheduledStart ?? ""),
    });

    revalidatePath("/diary");
    revalidatePath(`/jobs/${jobId}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof DiaryScheduleError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unable to move the job right now." },
      { status: 500 },
    );
  }
}
