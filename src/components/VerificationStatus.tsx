'use client'

import { useState } from 'react'
import { tr } from '@/translations/tr'

export default function VerificationStatus({ 
  isVerified, 
  email 
}: { 
  isVerified: boolean
  email: string 
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resendVerification = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Email Durumu:</span>
        {isVerified ? (
          <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Doğrulanmış
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">Doğrulanmamış</span>
            <button
              onClick={resendVerification}
              disabled={loading}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Gönderiliyor...' : 'Doğrulama Emaili Gönder'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {success && (
        <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
      )}
    </div>
  )
} 