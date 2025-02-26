import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: { salaryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { value } = await req.json()
    const salaryId = params.salaryId

    const result = await prisma.$transaction(async (tx) => {
      // Get the salary owner
      const salary = await tx.salary.findUnique({
        where: { id: salaryId },
        select: { userId: true }
      })

      if (!salary) {
        throw new Error('Salary not found')
      }

      // Handle existing vote
      const existingVote = await tx.vote.findUnique({
        where: {
          userId_salaryId: {
            userId: session.user.id,
            salaryId: salaryId,
          }
        }
      })

      // Update votes
      if (!existingVote) {
        await tx.vote.create({
          data: {
            value,
            userId: session.user.id,
            salaryId,
          }
        })
      } else if (existingVote.value === value) {
        await tx.vote.delete({
          where: {
            userId_salaryId: {
              userId: session.user.id,
              salaryId,
            }
          }
        })
      } else {
        await tx.vote.update({
          where: {
            userId_salaryId: {
              userId: session.user.id,
              salaryId,
            }
          },
          data: { value }
        })
      }

      // Get all salaries and their vote counts for this user
      const userSalaries = await tx.salary.findMany({
        where: { userId: salary.userId },
        include: {
          votes: true
        }
      })

      // Calculate total votes directly from votes
      const totalVotes = userSalaries.reduce((sum, salary) => 
        sum + salary.votes.reduce((voteSum, vote) => voteSum + vote.value, 0), 0
      )

      // Update user's total votes
      await tx.user.update({
        where: { id: salary.userId },
        data: { totalVotes }
      })

      return {
        debug: {
          userId: salary.userId,
          salaries: userSalaries.map(s => ({
            id: s.id,
            votes: s.votes.map(v => v.value),
            totalForSalary: s.votes.reduce((sum, v) => sum + v.value, 0)
          })),
          calculatedTotal: totalVotes
        }
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    )
  }
} 