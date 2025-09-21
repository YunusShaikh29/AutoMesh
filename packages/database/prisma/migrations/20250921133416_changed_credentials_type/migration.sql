/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Credential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Credential` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Credential` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Credential" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."Credentials";

-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_name_key" ON "public"."Credential"("userId", "name");
