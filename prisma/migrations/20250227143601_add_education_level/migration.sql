-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'ASSOCIATE', 'BACHELORS', 'MASTERS', 'PHD', 'OTHER');

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "educationLevel" "EducationLevel";
