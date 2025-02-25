import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { contactToken: true, contactTokenExpiry: true }
    })

    if (!user?.contactToken || !user.contactTokenExpiry || user.contactTokenExpiry < new Date()) {
      // Clear expired token
      if (user?.contactToken) {
        await prisma.user.update({
          where: { email: session.user.email },
          data: {
            contactToken: null,
            contactTokenExpiry: null,
          },
        })
      }
      return NextResponse.json({ token: null, expiry: null })
    }

    return NextResponse.json({ 
      token: user.contactToken,
      expiry: user.contactTokenExpiry 
    })
  } catch (error) {
    console.error('Token fetch error:', error)
    return NextResponse.json(
      { error: 'Token getirilemedi' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has a valid token
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { contactToken: true, contactTokenExpiry: true }
    })

    if (user?.contactToken && user.contactTokenExpiry && user.contactTokenExpiry > new Date()) {
      return NextResponse.json(
        { error: 'Zaten geçerli bir kodunuz var' },
        { status: 400 }
      )
    }

    // Generate a random token
    const token = randomBytes(16).toString('hex')
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Update user with new token
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        contactToken: token,
        contactTokenExpiry: expiry,
      },
    })

    return NextResponse.json({ token, expiry })
  } catch (error) {
    console.error('Token generation error:', error)
    return NextResponse.json(
      { error: 'Token oluşturulamadı' },
      { status: 500 }
    )
  }
} 