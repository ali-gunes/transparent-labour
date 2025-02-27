import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const salaryType = searchParams.get('salaryType') || 'all'

    // Base query filter
    const filter = salaryType !== 'all' 
      ? { salaryType }
      : {}

    // Get total entries
    const totalEntries = await prisma.salary.count({ where: filter })

    // Get average salary
    const avgResult = await prisma.salary.aggregate({
      where: filter,
      _avg: {
        amount: true
      }
    })
    const averageSalary = avgResult._avg.amount || 0

    // Get median salary
    const allSalaries = await prisma.salary.findMany({
      where: filter,
      select: {
        amount: true
      },
      orderBy: {
        amount: 'asc'
      }
    })
    const medianIndex = Math.floor(allSalaries.length / 2)
    const medianSalary = allSalaries.length > 0 ? allSalaries[medianIndex].amount : 0

    // Get most common position
    const positions = await prisma.salary.groupBy({
      where: filter,
      by: ['position'],
      _count: true,
      orderBy: {
        _count: {
          position: 'desc'
        }
      },
      take: 1
    })
    const topPosition = positions[0]?.position || 'N/A'

    // Get company with most entries
    const companies = await prisma.salary.groupBy({
      where: filter,
      by: ['company'],
      _count: true,
      orderBy: {
        _count: {
          company: 'desc'
        }
      },
      take: 1
    })
    const topCompany = companies[0]?.company || 'N/A'

    // Get salary distribution
    const salaryRanges = await getSalaryDistribution(filter)

    // Get company analytics
    const companyAnalytics = await getCompanyAnalytics(filter)

    // Get experience analytics
    const experienceAnalytics = await getExperienceAnalytics(filter)

    const response = {
      stats: {
        totalEntries,
        averageSalary,
        medianSalary,
        topPosition,
        topCompany
      },
      distribution: salaryRanges,
      companyAnalytics,
      experienceAnalytics
    }

    console.log('API Response:', {
      totalEntries,
      companyAnalyticsCount: companyAnalytics.length,
      experienceAnalyticsCount: experienceAnalytics.length
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Statistics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

async function getSalaryDistribution(filter: any) {
  const salaries = await prisma.salary.findMany({
    where: filter,
    select: {
      amount: true
    }
  })

  // Create salary ranges
  const ranges = [
    { min: 0, max: 15000 },
    { min: 15000, max: 25000 },
    { min: 25000, max: 35000 },
    { min: 35000, max: 45000 },
    { min: 45000, max: 55000 },
    { min: 55000, max: 70000 },
    { min: 70000, max: 85000 },
    { min: 85000, max: 100000 },
    { min: 100000, max: Infinity }
  ]

  const distribution = ranges.map(range => ({
    range: range.max === Infinity
      ? `${range.min / 1000}k+`
      : `${range.min / 1000}k-${range.max / 1000}k`,
    count: salaries.filter(
      s => s.amount >= range.min && s.amount < range.max
    ).length
  }))

  return distribution
}

async function getCompanyAnalytics(filter: any) {
  try {
    // Get company stats
    const companyStats = await prisma.salary.groupBy({
      by: ['company'],
      where: {
        ...filter,
        company: { not: null }
      },
      _count: {
        company: true
      },
      _avg: {
        amount: true,
        experience: true
      },
      having: {
        company: {
          _count: {
            gt: 1
          }
        }
      }
    })

    // Get focus area stats
    const focusStats = await prisma.salary.groupBy({
      by: ['companyFocus'],
      where: {
        ...filter,
        company: null,
        companyFocus: { not: null }
      },
      _count: {
        companyFocus: true
      },
      _avg: {
        amount: true,
        experience: true
      },
      having: {
        companyFocus: {
          _count: {
            gt: 1
          }
        }
      }
    })

    console.log('Analytics Raw:', {
      companiesFound: companyStats.length,
      focusAreasFound: focusStats.length
    })

    const processedCompanyStats = companyStats.map(company => ({
      name: company.company || '',
      averageSalary: Math.round(company._avg.amount || 0),
      employeeCount: company._count.company,
      experienceAvg: Number((company._avg.experience || 0).toFixed(1)),
      isFocus: false
    }))

    const processedFocusStats = focusStats.map(focus => ({
      name: focus.companyFocus || '',
      averageSalary: Math.round(focus._avg.amount || 0),
      employeeCount: focus._count.companyFocus,
      experienceAvg: Number((focus._avg.experience || 0).toFixed(1)),
      isFocus: true
    }))

    const combinedStats = [...processedCompanyStats, ...processedFocusStats]

    console.log('Analytics Processed:', {
      totalEntries: combinedStats.length,
      companies: processedCompanyStats.length,
      focusAreas: processedFocusStats.length
    })

    return combinedStats.sort((a, b) => b.averageSalary - a.averageSalary)

  } catch (error: any) {
    console.error('Analytics Error:', error?.message || 'Unknown error')
    return []
  }
}

async function getExperienceAnalytics(filter: any) {
  try {
    const salaries = await prisma.salary.findMany({
      where: filter,
      select: {
        experience: true,
        amount: true,
        position: true
      }
    })

    console.log('Experience Analytics:', {
      totalEntries: salaries.length,
      sampleEntry: salaries[0]
    })

    return salaries.map(salary => ({
      experience: salary.experience,
      salary: salary.amount,
      position: salary.position
    }))
  } catch (error) {
    console.error('Experience Analytics Error:', error)
    return []
  }
} 