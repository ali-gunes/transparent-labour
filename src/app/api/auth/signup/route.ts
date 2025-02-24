import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { hashPassword } from '@/lib/hash'

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()
    const hashedEmail = hashPassword(email) // Hash email for storage

    // Check if username/email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: hashedEmail },
          { username }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create new user with hashed email, password, and verification token
    const user = await prisma.user.create({
      data: {
        email: hashedEmail,     // Store hashed email
        username,
        password,  // Already hashed from client
        verificationToken,
        verificationTokenExpiry
      }
    })

    // Send verification email to original email address
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({ message: 'Kayıt başarılı. Lütfen email adresinizi doğrulayın.' })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 