/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Workshop` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED');

-- DropIndex
DROP INDEX "Workshop_stripeCustomerId_key";

-- DropIndex
DROP INDEX "Workshop_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "trialEndsAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_workshopId_key" ON "Subscription"("workshopId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
