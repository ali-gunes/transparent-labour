import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { hashPassword } from '@/lib/hash'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const hashedEmail = hashPassword(email)

    const user = await prisma.user.findUnique({
      where: { email: hashedEmail }
    })

    if (!user) {
      // Return success even if user not found for security
      return NextResponse.json({ message: 'If an account exists, a reset email has been sent' })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({ message: 'If an account exists, a reset email has been sent' })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 