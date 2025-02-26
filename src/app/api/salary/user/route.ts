import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { SalaryResponse } from '@/types/salary'

// Add type for database salary
type DBSalary = {
  id: string
  createdAt: Date
  votes: { value: number }[]
  position: string
  company: string
  experience: number
  location: string
  source: string
  sourceNote: string | null
  salaryType: string
  rangeMax: number
  rangeMin: number
  submittedBy: string
  voteCount: number
  startDate: Date | null
  endDate: Date | null
  isCurrent: boolean
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        salaries: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.salaries)
  } catch (error) {
    console.error('Error fetching user salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 