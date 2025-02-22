import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/hash'

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error('Missing credentials')
          }

          const user = await prisma.user.findUnique({
            where: { username: credentials.username }
          })

          if (!user) {
            throw new Error('User not found')
          }

          const hashedPassword = hashPassword(credentials.password)
          if (hashedPassword !== user.password) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
        session.user.username = token.username as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
})

export { handler as GET, handler as POST } 