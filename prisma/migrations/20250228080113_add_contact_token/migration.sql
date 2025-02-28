/*
  Warnings:

  - A unique constraint covering the columns `[contactToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "contactToken" TEXT,
ADD COLUMN     "contactTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_contactToken_key" ON "users"("contactToken");
