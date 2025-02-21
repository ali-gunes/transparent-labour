import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Add type for salary
type Salary = {
  id: string
  amount: number
  position: string
  company: string
  experience: number
  location: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { amount, position, company, experience, location } = await req.json()

    // Basic validation
    if (!amount || !position || !company || !experience || !location) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
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

    const salary = await prisma.salary.create({
      data: {
        amount,
        position,
        company,
        experience,
        location,
        userId: user.id
      }
    })

    return NextResponse.json(salary, { status: 201 })
  } catch (error) {
    console.error('Salary submission error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = Number(searchParams.get('limit')) || 50

    const salaries = await prisma.salary.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
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
    console.error('Failed to fetch salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 