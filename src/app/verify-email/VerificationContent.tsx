'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { tr } from '@/translations/tr'

export default function VerificationContent() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
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

    async function verifyEmail() {
      try {
        const res = await fetch(`/api/verify-email?token=${token}`)
        
        if (res.redirected) {
          setStatus('success')
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 2000)
          return
        }

        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error)
        }

        setStatus('success')
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 2000)
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Doğrulama işlemi başarısız oldu')
      }
    }

    verifyEmail()
  }, [token, router])

  if (status === 'verifying') {
    return <p>{tr.common.loading}</p>
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
      <p className="text-green-600 dark:text-green-400">
        {tr.auth.verify.success}
      </p>
    </div>
  )
} 