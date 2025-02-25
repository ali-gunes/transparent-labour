-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "startDate" TIMESTAMP(3);
