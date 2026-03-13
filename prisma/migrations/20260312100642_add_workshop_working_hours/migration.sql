-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "engineSizeCc" INTEGER;

-- AlterTable
ALTER TABLE "Workshop" ADD COLUMN     "workingDayEndMins" INTEGER NOT NULL DEFAULT 1080,
ADD COLUMN     "workingDayStartMins" INTEGER NOT NULL DEFAULT 480;
