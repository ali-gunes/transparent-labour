import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { value } = await req.json() // value should be 1 or -1

    // Find existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_salaryId: {
          userId: session.user.id,
          salaryId: params.id
        }
      }
    })

    // Start a transaction
    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      if (existingVote) {
        if (existingVote.value === value) {
          // Remove vote if clicking same button
          await tx.vote.delete({
            where: { id: existingVote.id }
          })
          
          // Update salary vote count
          await tx.salary.update({
            where: { id: params.id },
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
            where: { id: params.id },
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
            salaryId: params.id
          }
        })
        
        // Update salary vote count
        await tx.salary.update({
          where: { id: params.id },
          data: { voteCount: { increment: value } }
        })
        
        return { action: 'added' }
      }
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: `Failed to vote: ${error.message}` },
      { status: 500 }
    )
  }
} 