/*
  Warnings:

  - You are about to drop the column `trigger` on the `Execution` table. All the data in the column will be lost.
  - The `status` column on the `Execution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Execution" DROP COLUMN "trigger",
ADD COLUMN     "triggerData" JSONB,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
