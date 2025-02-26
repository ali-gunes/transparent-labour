import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { salaryId: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.username) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { value } = await req.json()

    // Validate vote value
    if (typeof value !== 'number' || ![1, -1].includes(value)) {
      return NextResponse.json({ error: 'Invalid vote value' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { username: session.user.username }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if salary exists
    const salary = await prisma.salary.findUnique({
      where: { id: params.salaryId }
    })

    if (!salary) {
      return NextResponse.json({ error: 'Salary not found' }, { status: 404 })
    }

    // Create or update vote
    const vote = await prisma.vote.upsert({
      where: {
        userId_salaryId: {
          userId: user.id,
          salaryId: params.salaryId
        }
      },
      update: { value },
      create: {
        userId: user.id,
        salaryId: params.salaryId,
        value
      }
    })

    // Update salary vote count
    const voteCount = await prisma.vote.aggregate({
      where: { salaryId: params.salaryId },
      _sum: { value: true }
    })

    await prisma.salary.update({
      where: { id: params.salaryId },
      data: { voteCount: voteCount._sum.value || 0 }
    })

    // Update user total votes
    const userVoteCount = await prisma.vote.aggregate({
      where: { userId: user.id },
      _sum: { value: true }
    })

    await prisma.user.update({
      where: { id: user.id },
      data: { totalVotes: userVoteCount._sum.value || 0 }
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
} 