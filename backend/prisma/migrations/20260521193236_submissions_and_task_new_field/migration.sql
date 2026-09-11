-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "remainingConclusions" INTEGER;

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attachmentKey" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validatorId" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
