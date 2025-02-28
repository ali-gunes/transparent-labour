import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function markEarlyAdapters() {
  try {
    // Get the first 100 users by creation date
    const earlyUsers = await prisma.user.findMany({
      take: 100,
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        username: true,
        createdAt: true
      }
    })

    console.log(`Found ${earlyUsers.length} early adapters`)

    // Update these users to mark them as early adapters
    const updates = earlyUsers.map(user => 
      prisma.user.update({
        where: { id: user.id },
        data: { isEarlyAdapter: true }
      })
    )

    await Promise.all(updates)

    console.log('Successfully marked early adapters')
    console.log('Early adapters:')
    earlyUsers.forEach(user => {
      console.log(`- ${user.username} (joined ${user.createdAt.toLocaleDateString()})`)
    })

  } catch (error) {
    console.error('Error marking early adapters:', error)
  } finally {
    await prisma.$disconnect()
  }
}

markEarlyAdapters() 