import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { SalaryResponse } from '@/types/salary'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const salaries = await prisma.salary.findMany({
      where: { userId: user.id },
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
        votes: {
          where: { userId: session.user.id },
          select: { value: true }
        }
      }
    })

    return NextResponse.json(salaries.map((salary: SalaryResponse) => ({
      ...salary,
      salaryRange: {
        min: salary.rangeMin,
        max: salary.rangeMax
      },
      userVote: Array.isArray(salary.votes) ? salary.votes[0]?.value : undefined
    })))
  } catch (error) {
    console.error('Failed to fetch user salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 