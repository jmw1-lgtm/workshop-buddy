-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('BOOKED', 'ARRIVED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_COLLECTION', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "town" TEXT,
    "postcode" TEXT,
    "slotLengthMins" INTEGER NOT NULL DEFAULT 60,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkshopUser" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'owner',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkshopUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "fuel" TEXT,
    "engine" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobType" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "jobTypeId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'BOOKED',
    "scheduledStart" TIMESTAMP(3) NOT NULL,
    "durationMins" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_clerkOrgId_key" ON "Workshop"("clerkOrgId");

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_slug_key" ON "Workshop"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_stripeCustomerId_key" ON "Workshop"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Workshop_stripeSubscriptionId_key" ON "Workshop"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "WorkshopUser_clerkUserId_idx" ON "WorkshopUser"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkshopUser_workshopId_clerkUserId_key" ON "WorkshopUser"("workshopId", "clerkUserId");

-- CreateIndex
CREATE INDEX "Customer_workshopId_name_idx" ON "Customer"("workshopId", "name");

-- CreateIndex
CREATE INDEX "Vehicle_workshopId_customerId_idx" ON "Vehicle"("workshopId", "customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_workshopId_registration_key" ON "Vehicle"("workshopId", "registration");

-- CreateIndex
CREATE UNIQUE INDEX "JobType_workshopId_name_key" ON "JobType"("workshopId", "name");

-- CreateIndex
CREATE INDEX "Job_workshopId_scheduledStart_idx" ON "Job"("workshopId", "scheduledStart");

-- CreateIndex
CREATE INDEX "Job_workshopId_status_idx" ON "Job"("workshopId", "status");

-- AddForeignKey
ALTER TABLE "WorkshopUser" ADD CONSTRAINT "WorkshopUser_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobType" ADD CONSTRAINT "JobType_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
