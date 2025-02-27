import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
// import type { SalaryResponse } from '@/types/salary'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'

// Remove unused Salary type and keep only SalaryResponse
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    //console.log('Full session:', JSON.stringify(session, null, 2))

    if (!session?.user) {
      console.log('No session or user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Session user:', JSON.stringify(session.user, null, 2))

    // Instead of finding by username, let's find by id since we know it's required
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      console.log('User not found with id:', session.user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await req.json()
    //console.log('Received salary data:', data)
    //console.log('User found:', user)

    // Calculate salary range
    const range = calculateSalaryRange(data.amount)

    const salary = await prisma.salary.create({
      data: {
        amount: data.amount,
        position: data.position,
        company: data.company || null,
        companyFocus: data.company ? null : data.companyFocus,
        experience: data.experience,
        location: data.location,
        source: data.source,
        sourceNote: data.sourceNote,
        salaryType: data.salaryType,
        rangeMin: range.min,
        rangeMax: range.max,
        submittedBy: data.submittedBy,
        voteCount: 0,
        userId: session.user.id,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent,
        // Add new fields conditionally
        ...(data.source === 'SELF' ? {
          workLifeBalance: parseInt(data.workLifeBalance),
          compensationSatisfaction: parseInt(data.compensationSatisfaction),
          salarySatisfaction: parseInt(data.salarySatisfaction),
        } : {})
      }
    })

    console.log('Created salary:', salary)
    return NextResponse.json(salary)

  } catch (error: unknown) {
    console.error('Server error in POST /api/salary:', error)
    return NextResponse.json(
      { error: `Failed to create salary: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

// function calculateSalaryRange(amount: number) {
//   const variance = 0.1 // 10% variance
//   const min = Math.floor(amount * (1 - variance))
//   const max = Math.ceil(amount * (1 + variance))
//   return { min, max }
// }
function calculateSalaryRange(amount: number) {
  const ranges = [
    { min: 25000, max: 75000, varianceMin: 0.10, varianceMax: 0.15, roundTo: 500 },  // Was 15-20%
    { min: 75000, max: 125000, varianceMin: 0.08, varianceMax: 0.12, roundTo: 1000 },  // Was 12-18%
    { min: 125000, max: 175000, varianceMin: 0.06, varianceMax: 0.10, roundTo: 1000 }, // Was 10-15%
    { min: 175000, max: 250000, varianceMin: 0.05, varianceMax: 0.08, roundTo: 2000 }, // Was 8-12%
    { min: 250000, max: Infinity, varianceMin: 0.03, varianceMax: 0.06, roundTo: 5000 } // Was 5-10%
  ];

  // Find the applicable range
  const range = ranges.find(r => amount >= r.min && amount < r.max);
  if (!range) return { min: amount, max: amount }; // Fallback (shouldn't happen)

  // Select separate random variances for min and max (ensuring they are different)
  const varianceMin = Math.random() * (range.varianceMax - range.varianceMin) + range.varianceMin;
  const varianceMax = Math.random() * (range.varianceMax - range.varianceMin) + range.varianceMin;

  // Apply the variance
  let min = amount * (1 - varianceMin) + 2499;
  let max = amount * (1 + varianceMax);

  // Round to the nearest specified multiple
  min = Math.round(min / range.roundTo) * range.roundTo;
  max = Math.round(max / range.roundTo) * range.roundTo;

  return { min, max };
}

type SalaryFromDB = {
  id: string
  position: string
  company: string
  experience: number
  location: string
  source: string
  sourceNote: string | null
  createdAt: Date
  salaryType: string
  rangeMin: number
  rangeMax: number
  submittedBy: string
  voteCount: number
  workLifeBalance: number | null
  compensationSatisfaction: number | null
  salarySatisfaction: number | null
  votes: { value: number }[] | false
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const minSalary = searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : undefined
    const maxSalary = searchParams.get('maxSalary') ? parseInt(searchParams.get('maxSalary')!) : undefined
    const sortBy = searchParams.get('sortBy') || 'newest'
    const salaryType = searchParams.get('salaryType') || undefined
    const minExperience = searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience')!) : undefined
    const maxExperience = searchParams.get('maxExperience') ? parseInt(searchParams.get('maxExperience')!) : undefined
    const source = searchParams.get('source') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined
    const companyFocus = searchParams.get('companyFocus') || undefined

    // Get user session for vote info
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Build where clause
    const where: any = {}

    // Search in position, company, location, or companyFocus
    if (search) {
      where.OR = [
        { position: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { companyFocus: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Salary range filter
    if (minSalary) {
      where.rangeMin = {
        gte: minSalary
      }
    }
    if (maxSalary) {
      where.rangeMax = {
        lte: maxSalary
      }
    }

    // Salary type filter
    if (salaryType) {
      where.salaryType = salaryType
    }

    // Experience range filter
    if (minExperience !== undefined) {
      where.experience = {
        ...where.experience,
        gte: minExperience
      }
    }
    if (maxExperience !== undefined) {
      where.experience = {
        ...where.experience,
        lte: maxExperience
      }
    }

    // Source type filter
    if (source) {
      where.source = source
    }

    // Company focus filter
    if (companyFocus) {
      where.companyFocus = companyFocus
    }

    // Date range filter
    if (startDate) {
      where.createdAt = {
        ...where.createdAt,
        gte: new Date(startDate)
      }
    }
    if (endDate) {
      where.createdAt = {
        ...where.createdAt,
        lte: new Date(endDate)
      }
    }

    // Build sort object
    const orderBy: any = {}
    switch (sortBy) {
      case 'maxSalary':
        orderBy.rangeMax = 'desc'
        break
      case 'minSalary':
        orderBy.rangeMin = 'asc'
        break
      case 'mostVoted':
        orderBy.voteCount = 'desc'
        break
      default: // 'newest'
        orderBy.createdAt = 'desc'
    }

    // Get total count for pagination
    const total = await prisma.salary.count({ where })

    // Get paginated results
    const salaries = await prisma.salary.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        votes: userId ? {
          where: { userId }
        } : false,
        user: {
          select: {
            totalVotes: true,
            role: true
          }
        }
      }
    })

    // Format response
    const formattedSalaries = salaries.map(salary => ({
      ...salary,
      userVote: salary.votes?.[0]?.value || 0,
      votes: undefined
    }))

    return NextResponse.json({
      salaries: formattedSalaries,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    })

  } catch (error) {
    console.error('Failed to fetch salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 