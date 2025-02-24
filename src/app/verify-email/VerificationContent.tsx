'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { tr } from '@/translations/tr'

export default function VerificationContent() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Geçersiz doğrulama bağlantısı')
      return
    }

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error)
        }

        setStatus('success')
        setMessage('Email adresiniz başarıyla doğrulandı')
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 2000)
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Doğrulama başarısız oldu')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <>
      {status === 'verifying' && (
        <p className="text-gray-600 dark:text-gray-300">Email adresiniz doğrulanıyor...</p>
      )}
      {status === 'success' && (
        <p className="text-green-600 dark:text-green-400">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 dark:text-red-400">{message}</p>
      )}
    </>
  )
} 