/*
  Warnings:

  - Added the required column `rangeMax` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rangeMin` to the `Salary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "rangeMax" INTEGER NOT NULL,
ADD COLUMN     "rangeMin" INTEGER NOT NULL;
