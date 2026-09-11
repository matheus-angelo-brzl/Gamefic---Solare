/*
  Warnings:

  - Made the column `position` on table `Ranking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ranking" ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recordPosition" INTEGER NOT NULL DEFAULT 0;
