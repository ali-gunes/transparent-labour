import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prismaClient = new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient
}

export const prisma = global.prisma || prismaClient

// Test connection
prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Database connection failed:', error)) 