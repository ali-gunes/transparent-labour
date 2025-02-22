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
        salaryType: salaryType || 'net'
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

    const salariesWithRange = salaries.map((salary: Salary) => {
      // Round to nearest multiple of 5000
      const roundedAmount = Math.round(salary.amount / 5000) * 5000
      const randomVariations = [4000, 5000, 6000, 8000]
      const minVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)]
      const maxVariation = randomVariations[Math.floor(Math.random() * randomVariations.length)]
      
      return {
        ...salary,
        salaryRange: {
          min: roundedAmount - minVariation,
          max: roundedAmount + maxVariation
        }
      }
    })

    return NextResponse.json(salariesWithRange)
  } catch (error) {
    console.error('Failed to fetch salaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch salaries' },
      { status: 500 }
    )
  }
} 