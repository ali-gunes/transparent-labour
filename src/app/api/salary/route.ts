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

type SalaryResponse = {
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

    const { amount, position, company, experience, location, salaryType, source, sourceNote } = await req.json()

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

    // Calculate range once during submission
    let rangeMin, rangeMax
    if (amount > 22105) {
      const roundedAmount = Math.round(amount / 5000) * 5000
      const randomVariations = [4000, 5000, 6000, 7000]
      const minVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)]
      const maxVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)]
      rangeMin = roundedAmount - minVariation
      rangeMax = roundedAmount + maxVariation
    } else {
      rangeMin = amount
      rangeMax = amount
    }

    const salary = await prisma.salary.create({
      data: {
        amount,
        position,
        company,
        experience,
        location,
        userId: user.id,
        source: source || 'SELF',
        sourceNote: sourceNote || null,
        salaryType: salaryType || 'net',
        rangeMin,
        rangeMax
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
      }
    })

    return NextResponse.json(salaries.map((salary: SalaryResponse) => ({
      ...salary,
      salaryRange: {
        min: salary.rangeMin,
        max: salary.rangeMax
      }
    })))
  } catch (error) {
    console.error('Failed to fetch salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 