-- Add nullable rollups so historical workshops remain explicitly unknown until tracked.
ALTER TABLE "Workshop"
ADD COLUMN "activityTrackingStartedAt" TIMESTAMP(3),
ADD COLUMN "lastLoginAt" TIMESTAMP(3),
ADD COLUMN "lastActivityAt" TIMESTAMP(3);

-- One row per Clerk session lets the application record genuine logins once,
-- without treating page refreshes as new logins.
CREATE TABLE "WorkshopAuthSession" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "clerkSessionId" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkshopAuthSession_pkey" PRIMARY KEY ("id")
);

-- A unique workshop/date row makes distinct active-day counting exact and cheap.
CREATE TABLE "WorkshopActivityDay" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "activityDate" DATE NOT NULL,
    "firstActivityAt" TIMESTAMP(3) NOT NULL,
    "lastActivityAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopActivityDay_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WorkshopAuthSession_clerkSessionId_key" ON "WorkshopAuthSession"("clerkSessionId");
CREATE INDEX "WorkshopAuthSession_workshopId_loginAt_idx" ON "WorkshopAuthSession"("workshopId", "loginAt");
CREATE UNIQUE INDEX "WorkshopActivityDay_workshopId_activityDate_key" ON "WorkshopActivityDay"("workshopId", "activityDate");
CREATE INDEX "WorkshopActivityDay_workshopId_lastActivityAt_idx" ON "WorkshopActivityDay"("workshopId", "lastActivityAt");

ALTER TABLE "WorkshopAuthSession"
ADD CONSTRAINT "WorkshopAuthSession_workshopId_fkey"
FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkshopActivityDay"
ADD CONSTRAINT "WorkshopActivityDay_workshopId_fkey"
FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
