import { NextResponse } from "next/server";

import { prisma } from "@/db/prisma";

const SERVICE = "workshop-buddy";

// Avoid caching: this must reflect live database state on every request.
export const dynamic = "force-dynamic";

export async function GET() {
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
