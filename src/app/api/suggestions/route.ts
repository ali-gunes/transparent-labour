import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const field = searchParams.get('field')
    const query = searchParams.get('q')?.toLowerCase() || ''
    const limit = Number(searchParams.get('limit')) || 5

    if (!field || !['position', 'company', 'location'].includes(field)) {
      return NextResponse.json({ error: 'Invalid field parameter' }, { status: 400 })
    }

    // Get unique values for the specified field
    const results = await prisma.salary.findMany({
      where: {
        [field]: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        [field]: true
      },
      distinct: [field as Prisma.SalaryScalarFieldEnum],
      take: limit,
      orderBy: {
        [field]: 'asc' as Prisma.SortOrder
      }
    })

    // Extract unique values
    const suggestions = results.map(result => result[field as keyof typeof result])

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Suggestions error:', error)
    return NextResponse.json({ error: 'Failed to fetch suggestions' }, { status: 500 })
  }
} 