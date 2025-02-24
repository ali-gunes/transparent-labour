import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/hash'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Geçersiz istek' },
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

    const hashedPassword = hashPassword(password)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({ message: 'Şifreniz başarıyla güncellendi' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Şifre sıfırlama işlemi başarısız oldu' },
      { status: 500 }
    )
  }
} 