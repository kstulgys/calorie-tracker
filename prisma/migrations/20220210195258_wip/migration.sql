/*
  Warnings:

  - Changed the type of `calories` on the `Entry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "calories",
ADD COLUMN     "calories" INTEGER NOT NULL;
