import { NextResponse } from "next/server";

import { prisma } from "@/db/prisma";

const SERVICE = "workshop-buddy";

// Avoid caching: this must reflect live database state on every request.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Optional protection: when CRON_SECRET is set, require Vercel Cron's
  // `Authorization: Bearer <secret>` header. When unset (e.g. local dev),
  // the check is skipped so the endpoint stays reachable.
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      {
        ok: false,
        service: SERVICE,
        error: "Unauthorized",
        checkedAt: new Date().toISOString(),
      },
      { status: 401 },
    );
  }

  const start = Date.now();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      service: SERVICE,
      db: "ok",
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - start,
    });
  } catch {
    // Never surface connection strings, user data, or stack traces.
    return NextResponse.json(
      {
        ok: false,
        service: SERVICE,
        db: "error",
        error: "Database connectivity check failed",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
