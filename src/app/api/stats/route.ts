import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalSalaries,
      totalCompanies,
      totalPositions,
      totalLocations,
      averageVotes
    ] = await Promise.all([
      prisma.salary.count(),
      prisma.salary.groupBy({
        by: ['company'],
        _count: true
      }).then(res => res.length),
      prisma.salary.groupBy({
        by: ['position'],
        _count: true
      }).then(res => res.length),
      prisma.salary.groupBy({
        by: ['location'],
        _count: true
      }).then(res => res.length),
      prisma.salary.aggregate({
        _avg: {
          voteCount: true
        }
      }).then(res => Math.round(res._avg.voteCount || 0))
    ])

    return NextResponse.json({
      totalSalaries,
      totalCompanies,
      totalPositions,
      totalLocations,
      averageVotes
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
} 