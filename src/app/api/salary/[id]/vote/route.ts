import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import type { PrismaClient } from '@prisma/client'


export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { value } = await request.json() // value should be 1 or -1
    const { id } = context.params

    // Find existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_salaryId: {
          userId: session.user.id,
          salaryId: id
        }
      }
    })

    // Start a transaction
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$transaction'>) => {
      if (existingVote) {
        if (existingVote.value === value) {
          // Remove vote if clicking same button
          await tx.vote.delete({
            where: { id: existingVote.id }
          })
          
          // Update salary vote count
          await tx.salary.update({
            where: { id },
            data: { voteCount: { decrement: value } }
          })
          
          return { action: 'removed' }
        } else {
          // Change vote
          await tx.vote.update({
            where: { id: existingVote.id },
            data: { value }
          })
          
          // Update salary vote count (double the value since we're changing from -1 to 1 or vice versa)
          await tx.salary.update({
            where: { id },
            data: { voteCount: { increment: value * 2 } }
          })
          
          return { action: 'changed' }
        }
      } else {
        // Create new vote
        await tx.vote.create({
          data: {
            value,
            userId: session.user.id,
            salaryId: id
          }
        })
        
        // Update salary vote count
        await tx.salary.update({
          where: { id },
          data: { voteCount: { increment: value } }
        })
        
        return { action: 'added' }
      }
    })

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: `Failed to vote: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
