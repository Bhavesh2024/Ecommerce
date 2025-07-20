/*
  Warnings:

  - The `type` column on the `Request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 0;
