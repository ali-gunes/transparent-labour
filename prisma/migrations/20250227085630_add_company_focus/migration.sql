-- CreateEnum
CREATE TYPE "CompanyFocus" AS ENUM ('TECHNOLOGY', 'BANKING', 'FINANCE', 'MANUFACTURING', 'DEFENSE', 'LOGISTICS', 'RETAIL', 'HEALTHCARE', 'EDUCATION', 'CONSULTING', 'TELECOM', 'ENERGY', 'AUTOMOTIVE', 'ECOMMERCE', 'GAMING', 'MEDIA', 'OTHER');

-- AlterTable
ALTER TABLE "Salary" ADD COLUMN     "companyFocus" "CompanyFocus",
ALTER COLUMN "company" DROP NOT NULL;
