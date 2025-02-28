/*
  Warnings:

  - The `workType` column on the `Salary` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Salary" DROP COLUMN "workType",
ADD COLUMN     "workType" "WorkType" NOT NULL DEFAULT 'ONSITE';
