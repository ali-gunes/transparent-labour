-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('ONSITE', 'REMOTE');

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "workType" "WorkType" NOT NULL DEFAULT 'ONSITE';
