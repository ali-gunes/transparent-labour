import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get salaryId from URL
    const salaryId = request.url.split('/salary/')[1].split('/vote')[0]
    const data = await request.json()
    const { value } = data

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_salaryId: {
          userId: user.id,
          salaryId: salaryId,
        },
      },
    })

    if (existingVote) {
      // Update existing vote
      await prisma.vote.update({
        where: {
          userId_salaryId: {
            userId: user.id,
            salaryId: salaryId,
          },
        },
        data: { value },
      })
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          value,
          userId: user.id,
          salaryId: salaryId,
        },
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Vote error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 