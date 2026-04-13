-- CreateEnum
CREATE TYPE "JobLineItemType" AS ENUM ('LABOUR', 'PART', 'MISC');

-- AlterTable
ALTER TABLE "Job"
ADD COLUMN     "internalNotes" TEXT,
ADD COLUMN     "technicianNotes" TEXT;

-- CreateTable
CREATE TABLE "JobLineItem" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "itemType" "JobLineItemType" NOT NULL DEFAULT 'LABOUR',
    "quantity" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobLineItem_workshopId_jobId_idx" ON "JobLineItem"("workshopId", "jobId");

-- CreateIndex
CREATE INDEX "JobLineItem_jobId_position_idx" ON "JobLineItem"("jobId", "position");

-- AddForeignKey
ALTER TABLE "JobLineItem" ADD CONSTRAINT "JobLineItem_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLineItem" ADD CONSTRAINT "JobLineItem_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
