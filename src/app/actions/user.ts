'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { UserProfile } from '@/types/user'

export async function getUserProfile() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      emailVerified: true,
      username: true,
      salaries: {
        select: {
          id: true,
          position: true,
          company: true,
          rangeMin: true,
          rangeMax: true,
          salaryType: true,
          experience: true,
          location: true,
          source: true,
          sourceNote: true,
          createdAt: true,
          submittedBy: true,
          voteCount: true,
          votes: {
            where: { userId: session.user.id },
            select: { value: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  }) as unknown as UserProfile | null

  return user
} 