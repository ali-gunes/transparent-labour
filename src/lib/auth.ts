import { AuthOptions, DefaultUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/hash'
import { tr } from '@/translations/tr'
import { Role } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface User extends DefaultUser {
    emailVerified: boolean
    username: string
    role: Role
  }

  interface JWT {
    id: string
    email: string
    username: string
    role: Role
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
            throw new Error(tr.auth.errors.invalidCredentials)
          }

          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
              password: true,
              emailVerified: true
            }
          })

          if (!user) {
            throw new Error(tr.auth.errors.invalidCredentials)
          }

          const hashedPassword = hashPassword(credentials.password)
          if (hashedPassword !== user.password) {
            throw new Error(tr.auth.errors.invalidCredentials)
          }

          if (!user.emailVerified) {
            throw new Error(tr.auth.errors.verifyEmail)
          }

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            emailVerified: user.emailVerified
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
} 