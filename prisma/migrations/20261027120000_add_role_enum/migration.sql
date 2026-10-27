-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Membership" ALTER COLUMN "role" TYPE "Role" USING "role"::"Role";
ALTER TABLE "Membership" ALTER COLUMN "role" SET DEFAULT 'MEMBER'::"Role";
