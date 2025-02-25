import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect('/login?error=missing-token')
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    })

    if (!user || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
      return NextResponse.redirect('/login?error=invalid-token')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    })

    return NextResponse.redirect('/login?verified=true')
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect('/login?error=server-error')
  }
} 