import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Rate limiting: 3 attempts per hour per email
    const rateLimitKey = `verify_${email}`
    const isAllowed = await rateLimit(rateLimitKey, 3, 3600)

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Çok fazla deneme yaptınız. Lütfen bir saat sonra tekrar deneyin.' },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email adresi zaten doğrulanmış' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationTokenExpiry
      }
    })

    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({ message: 'Doğrulama emaili gönderildi' })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Doğrulama emaili gönderilemedi' },
      { status: 500 }
    )
  }
} 