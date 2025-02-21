import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

type Salary = {
  id: string
  amount: number
  position: string
  company: string
  experience: number
  location: string
  source: string
  sourceNote?: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
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
      orderBy: { createdAt: 'desc' }
    })

    const salariesWithRange = salaries.map((salary: Salary) => ({
      ...salary,
      salaryRange: {
        min: salary.amount - 5000,
        max: salary.amount + 5000
      }
    }))

    return NextResponse.json(salariesWithRange)
  } catch (error) {
    console.error('Failed to fetch user salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 