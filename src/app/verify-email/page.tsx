'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Geçersiz doğrulama bağlantısı')
      return
    }

    fetch(`/api/verify-email?token=${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Doğrulama başarısız oldu')
        }
        setStatus('success')
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 2000)
      })
      .catch((err) => {
        setStatus('error')
        setError(err.message)
      })
  }, [token, router])

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {status === 'loading' && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          E-posta adresiniz doğrulanıyor...
        </p>
      )}
      {status === 'success' && (
        <div className="text-center">
          <p className="text-green-600 dark:text-green-400 mb-2">
            E-posta adresiniz başarıyla doğrulandı!
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Giriş sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      )}
      {status === 'error' && (
        <p className="text-center text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
} 