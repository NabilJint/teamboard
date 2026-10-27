-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "Organization" ALTER COLUMN "plan" TYPE "Plan" USING "plan"::"Plan";
ALTER TABLE "Organization" ALTER COLUMN "plan" SET DEFAULT 'FREE'::"Plan";
