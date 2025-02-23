import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import type { SalaryResponse } from '@/types/salary'
import { authOptions } from '@/lib/auth'

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
        company: data.company,
        experience: data.experience,
        location: data.location,
        source: data.source,
        sourceNote: data.sourceNote,
        salaryType: data.salaryType,
        rangeMin: range.min,
        rangeMax: range.max,
        submittedBy: data.submittedBy,
        voteCount: 0,
        userId: session.user.id
      }
    })

    console.log('Created salary:', salary)
    return NextResponse.json(salary)

  } catch (error: any) {
    console.error('Server error in POST /api/salary:', error)
    return NextResponse.json(
      { error: `Failed to create salary: ${error.message}` },
      { status: 500 }
    )
  }
}

function calculateSalaryRange(amount: number) {
  const variance = 0.1 // 10% variance
  const min = Math.floor(amount * (1 - variance))
  const max = Math.ceil(amount * (1 + variance))
  return { min, max }
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
  votes: { value: number }[] | false
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit')) || 50

    console.log('Fetching salaries with session:', session?.user?.id)

    const salaries = await prisma.salary.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        position: true,
        company: true,
        experience: true,
        location: true,
        source: true,
        sourceNote: true,
        createdAt: true,
        salaryType: true,
        rangeMin: true,
        rangeMax: true,
        submittedBy: true,
        voteCount: true,
        votes: session?.user ? {
          where: {
            userId: session.user.id
          },
          select: {
            value: true
          }
        } : false
      }
    })

    console.log('Found salaries:', salaries.length)

    const formattedSalaries = salaries.map((salary: SalaryFromDB) => ({
      ...salary,
      salaryRange: {
        min: salary.rangeMin,
        max: salary.rangeMax
      },
      userVote: Array.isArray(salary.votes) ? salary.votes[0]?.value : undefined
    }))

    return NextResponse.json(formattedSalaries)
  } catch (error) {
    console.error('Server error in GET /api/salary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 