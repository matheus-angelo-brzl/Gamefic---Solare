/*
  Warnings:

  - A unique constraint covering the columns `[name,editionId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fileName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_name_editionId_key" ON "Task"("name", "editionId");
