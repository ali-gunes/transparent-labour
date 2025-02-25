import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { salaryId, value } = data

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Get the salary to find its author
      const salary = await tx.salary.findUnique({
        where: { id: salaryId },
        select: { userId: true }
      })

      if (!salary) {
        throw new Error('Salary not found')
      }

      // Update or create the vote
      const vote = await tx.vote.upsert({
        where: {
          userId_salaryId: {
            userId: session.user.id,
            salaryId: salaryId,
          },
        },
        create: {
          value: value,
          userId: session.user.id,
          salaryId: salaryId,
        },
        update: {
          value: value,
        },
      })

      // Update salary vote count
      const votes = await tx.vote.findMany({
        where: { salaryId: salaryId },
      })
      const voteCount = votes.reduce((sum, vote) => sum + vote.value, 0)

      await tx.salary.update({
        where: { id: salaryId },
        data: { voteCount }
      })

      // Update user's total votes
      const userTotalVotes = await tx.vote.findMany({
        where: { 
          salaryId: { in: await tx.salary.findMany({
            where: { userId: salary.userId },
            select: { id: true }
          }).then(salaries => salaries.map(s => s.id)) }
        }
      })
      
      const totalVotes = userTotalVotes.reduce((sum, vote) => sum + vote.value, 0)

      // Update user's total votes
      const updateUserVotes = await tx.$executeRaw`
        UPDATE "User" 
        SET "totalVotes" = ${totalVotes} 
        WHERE id = ${salary.userId}
      `;

      return { vote, voteCount, totalVotes }
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