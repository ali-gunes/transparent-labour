/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CompanyFocus" ADD VALUE 'INSURANCE';
ALTER TYPE "CompanyFocus" ADD VALUE 'REAL_ESTATE';
ALTER TYPE "CompanyFocus" ADD VALUE 'CONSTRUCTION';
ALTER TYPE "CompanyFocus" ADD VALUE 'TOURISM';
ALTER TYPE "CompanyFocus" ADD VALUE 'HOSPITALITY';
ALTER TYPE "CompanyFocus" ADD VALUE 'AGRICULTURE';
ALTER TYPE "CompanyFocus" ADD VALUE 'FMCG';
ALTER TYPE "CompanyFocus" ADD VALUE 'PHARMACEUTICAL';
ALTER TYPE "CompanyFocus" ADD VALUE 'ADVERTISING';
ALTER TYPE "CompanyFocus" ADD VALUE 'NGO';
ALTER TYPE "CompanyFocus" ADD VALUE 'GOVERNMENT';
ALTER TYPE "CompanyFocus" ADD VALUE 'LEGAL';
ALTER TYPE "CompanyFocus" ADD VALUE 'ARCHITECTURE';

-- DropForeignKey
ALTER TABLE "Salary" DROP CONSTRAINT "Salary_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropForeignKey
ALTER TABLE "anonymous_messages" DROP CONSTRAINT "anonymous_messages_userId_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "username" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpiry" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "isEarlyAdapter" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_verificationToken_key" ON "users"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anonymous_messages" ADD CONSTRAINT "anonymous_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
