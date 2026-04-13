-- AlterTable
ALTER TABLE "Workshop"
ADD COLUMN     "nextJobNumber" INTEGER NOT NULL DEFAULT 1001;

-- AlterTable
ALTER TABLE "Job"
ADD COLUMN     "jobNumber" INTEGER;

-- Backfill existing jobs with tenant-scoped sequential numbers.
WITH ranked_jobs AS (
    SELECT
        "id",
        "workshopId",
        ROW_NUMBER() OVER (
            PARTITION BY "workshopId"
            ORDER BY "createdAt" ASC, "scheduledStart" ASC, "id" ASC
        ) + 1000 AS generated_job_number
    FROM "Job"
)
UPDATE "Job" AS job
SET "jobNumber" = ranked_jobs.generated_job_number
FROM ranked_jobs
WHERE job."id" = ranked_jobs."id";

-- Advance each workshop counter to the next available number.
UPDATE "Workshop" AS workshop
SET "nextJobNumber" = COALESCE(next_numbers.next_job_number, 1001)
FROM (
    SELECT
        "workshopId",
        MAX("jobNumber") + 1 AS next_job_number
    FROM "Job"
    GROUP BY "workshopId"
) AS next_numbers
WHERE workshop."id" = next_numbers."workshopId";

-- Finalize the new visible reference column.
ALTER TABLE "Job"
ALTER COLUMN "jobNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_workshopId_jobNumber_key" ON "Job"("workshopId", "jobNumber");
