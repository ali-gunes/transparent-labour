import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Geçersiz token' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token }
    })

    if (!user) {
      return NextResponse.json({ error: 'Geçersiz veya kullanılmış doğrulama bağlantısı' }, { status: 400 })
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      return NextResponse.json({ error: 'Doğrulama bağlantısının süresi dolmuş' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    })

    return NextResponse.redirect('/login?verified=true', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ error: 'Doğrulama işlemi başarısız oldu' }, { status: 500 })
  }
} 