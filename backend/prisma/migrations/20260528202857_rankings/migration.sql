/*
  Warnings:

  - The `status` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Edition" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "status",
ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstPlaceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recordMissions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recordXp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "secondPlaceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "thirdPlaceCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "position" INTEGER,
    "xpCount" INTEGER NOT NULL,
    "missionsCount" INTEGER NOT NULL,
    "editionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ranking_editionId_xpCount_idx" ON "Ranking"("editionId", "xpCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Ranking_editionId_userId_key" ON "Ranking"("editionId", "userId");

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
