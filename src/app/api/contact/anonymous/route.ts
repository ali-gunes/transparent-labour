import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, subject, message } = body

    if (!token || !subject || !message) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurunuz' },
        { status: 400 }
      )
    }

    // Find user by token and verify it's not expired
    const user = await prisma.user.findUnique({
      where: { contactToken: token },
    })

    if (!user || !user.contactTokenExpiry || user.contactTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Geçersiz veya süresi dolmuş iletişim kodu' },
        { status: 400 }
      )
    }

    // Create anonymous message
    const anonymousMessage = await prisma.anonymousMessage.create({
      data: {
        userId: user.id,
        subject,
        message,
      },
    })

    // Clear the used token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        contactToken: null,
        contactTokenExpiry: null,
      },
    })

    return NextResponse.json(anonymousMessage)
  } catch (error) {
    console.error('Anonymous message error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
} 