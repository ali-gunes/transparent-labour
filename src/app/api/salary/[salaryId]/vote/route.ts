import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { salaryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { value } = data
    const salaryId = params.salaryId

    const result = await prisma.$transaction(async (tx) => {
      // Get the salary owner
      const salary = await tx.salary.findUnique({
        where: { id: salaryId },
        select: {
          userId: true,
          user: {
            select: {
              totalVotes: true,
              role: true
            }
          }
        }
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

    return Response.json(result)
  } catch (error) {
    console.error('Vote error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 