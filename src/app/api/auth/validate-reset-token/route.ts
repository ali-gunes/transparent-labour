import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Geçersiz token' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz veya kullanılmış sıfırlama bağlantısı' },
        { status: 400 }
      )
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Sıfırlama bağlantısının süresi dolmuş' },
        { status: 400 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Validate reset token error:', error)
    return NextResponse.json(
      { error: 'Doğrulama işlemi başarısız oldu' },
      { status: 500 }
    )
  }
} 