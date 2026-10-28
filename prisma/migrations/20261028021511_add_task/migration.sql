/*
  Warnings:

  - You are about to drop the column `description` on the `Task` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "description",
ADD COLUMN     "assigneeId" TEXT,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';

-- CreateIndex
CREATE INDEX "Task_organizationId_idx" ON "Task"("organizationId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
