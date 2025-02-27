import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'

// Helper function to convert BigInt to number
function convertBigIntToNumber(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      converted[key] = convertBigIntToNumber(obj[key]);
    }
    return converted;
  }
  
  return obj;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const salaryType = searchParams.get('salaryType') || 'all'

    // Build where clause for salary type
    const where = salaryType !== 'all' ? { salaryType } : {}

    // Get basic statistics
    const salaries = await prisma.salary.findMany({ where })
    const totalEntries = salaries.length
    const amounts = salaries.map(s => Number(s.amount)).sort((a, b) => a - b)
    const averageSalary = Math.round(amounts.reduce((a, b) => a + b, 0) / totalEntries)
    const medianSalary = amounts[Math.floor(totalEntries / 2)]

    // Get top position and company
    const positionCounts = new Map<string, number>()
    const companyCounts = new Map<string, number>()
    salaries.forEach(salary => {
      positionCounts.set(salary.position, (positionCounts.get(salary.position) || 0) + 1)
      if (salary.company) {
        companyCounts.set(salary.company, (companyCounts.get(salary.company) || 0) + 1)
      }
    })
    const topPosition = Array.from(positionCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || ''
    const topCompany = Array.from(companyCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    // Calculate salary distribution
    const maxAmount = Math.max(...amounts)
    const step = Math.ceil(maxAmount / 10)
    const distribution = Array.from({ length: 10 }, (_, i) => {
      const min = i * step
      const max = (i + 1) * step
      return {
        range: `₺${min.toLocaleString()} - ₺${max.toLocaleString()}`,
        count: amounts.filter(a => a >= min && a < max).length
      }
    })

    // Get company analytics
    const companyAnalytics = await prisma.$queryRaw<Array<{
      name: string
      averageSalary: number
      employeeCount: number
      experienceAvg: number
    }>>`
      SELECT 
        company as name,
        CAST(AVG(amount) AS integer) as "averageSalary",
        COUNT(*) as "employeeCount",
        CAST(AVG(CAST(experience AS float)) AS float) as "experienceAvg"
      FROM "Salary"
      WHERE company IS NOT NULL
      ${salaryType !== 'all' ? Prisma.sql`AND "salaryType" = ${salaryType}` : Prisma.empty}
      GROUP BY company
      HAVING COUNT(*) >= 3
      ORDER BY "averageSalary" DESC
      LIMIT 10
    `

    // Get company focus analytics
    const companyFocusAnalytics = await prisma.$queryRaw<Array<{
      focus: string
      averageSalary: number
      employeeCount: number
      experienceAvg: number
    }>>`
      SELECT 
        "companyFocus" as focus,
        CAST(AVG(amount) AS integer) as "averageSalary",
        COUNT(*) as "employeeCount",
        CAST(AVG(CAST(experience AS float)) AS float) as "experienceAvg"
      FROM "Salary"
      WHERE "companyFocus" IS NOT NULL
      ${salaryType !== 'all' ? Prisma.sql`AND "salaryType" = ${salaryType}` : Prisma.empty}
      GROUP BY "companyFocus"
      ORDER BY "averageSalary" DESC
    `

    // Get education level analytics
    const educationAnalytics = await prisma.$queryRaw<Array<{
      level: string
      averageSalary: number
      employeeCount: number
      experienceAvg: number
    }>>`
      SELECT 
        "educationLevel" as level,
        CAST(AVG(amount) AS integer) as "averageSalary",
        COUNT(*) as "employeeCount",
        CAST(AVG(CAST(experience AS float)) AS float) as "experienceAvg"
      FROM "Salary"
      WHERE "educationLevel" IS NOT NULL
      ${salaryType !== 'all' ? Prisma.sql`AND "salaryType" = ${salaryType}` : Prisma.empty}
      GROUP BY "educationLevel"
      ORDER BY "averageSalary" DESC
    `

    // Get experience analytics
    const experienceAnalytics = await prisma.$queryRaw<Array<{
      experience: number
      salary: number
      position: string
    }>>`
      SELECT 
        CAST(experience AS integer) as experience,
        CAST(AVG(amount) AS integer) as salary,
        mode() WITHIN GROUP (ORDER BY position) as position
      FROM "Salary"
      ${salaryType !== 'all' ? Prisma.sql`WHERE "salaryType" = ${salaryType}` : Prisma.empty}
      GROUP BY experience
      ORDER BY experience ASC
    `

    // Convert all numeric values to numbers
    const processedResponse = {
      stats: {
        averageSalary,
        totalEntries,
        topPosition,
        topCompany,
        medianSalary
      },
      distribution,
      companyAnalytics: companyAnalytics.map(item => ({
        ...item,
        averageSalary: Number(item.averageSalary),
        employeeCount: Number(item.employeeCount),
        experienceAvg: Number(item.experienceAvg)
      })),
      experienceAnalytics: experienceAnalytics.map(item => ({
        ...item,
        experience: Number(item.experience),
        salary: Number(item.salary)
      })),
      companyFocusAnalytics: companyFocusAnalytics.map(item => ({
        ...item,
        averageSalary: Number(item.averageSalary),
        employeeCount: Number(item.employeeCount),
        experienceAvg: Number(item.experienceAvg)
      })),
      educationAnalytics: educationAnalytics.map(item => ({
        ...item,
        averageSalary: Number(item.averageSalary),
        employeeCount: Number(item.employeeCount),
        experienceAvg: Number(item.experienceAvg)
      }))
    }

    return NextResponse.json(processedResponse)

  } catch (error) {
    console.error('Failed to fetch statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
} 