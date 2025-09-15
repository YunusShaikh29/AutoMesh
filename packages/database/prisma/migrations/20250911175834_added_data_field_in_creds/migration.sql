/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `apiSecret` on the `Credential` table. All the data in the column will be lost.
  - Added the required column `data` to the `Credential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Credential" DROP CONSTRAINT "Credential_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Credential" DROP COLUMN "apiKey",
DROP COLUMN "apiSecret",
ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
