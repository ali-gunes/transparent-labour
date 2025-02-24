'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

export default function ResetPasswordContent() {
  const [status, setStatus] = useState<'validating' | 'valid' | 'invalid'>('validating')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      setError('Geçersiz sıfırlama bağlantısı')
      return
    }

    async function validateToken() {
      try {
        const res = await fetch(`/api/auth/validate-reset-token?token=${token}`)
        if (!res.ok) {
          throw new Error((await res.json()).error)
        }
        setStatus('valid')
      } catch (error) {
        setStatus('invalid')
        setError(error instanceof Error ? error.message : 'Geçersiz veya süresi dolmuş bağlantı')
      }
    }

    validateToken()
  }, [token])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      setError(tr.settings.passwordMismatch)
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      // Redirect to login with success message
      router.push('/login?reset=success')
    } catch (err) {
      setError(err instanceof Error ? err.message : tr.auth.errors.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'validating') {
    return <p>{tr.common.loading}</p>
  }

  if (status === 'invalid') {
    return <p className="text-red-600 dark:text-red-400">{error}</p>
  }

  return (
    <form onSubmit={onSubmit} className={styles.formBody}>
      {error && <div className={styles.error}>{error}</div>}
      <div>
        <label htmlFor="password" className={styles.label}>
          {tr.auth.resetPassword.newPassword}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
          className={styles.input}
          placeholder={tr.auth.resetPassword.newPasswordPlaceholder}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className={styles.label}>
          {tr.auth.resetPassword.confirmPassword}
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          className={styles.input}
          placeholder={tr.auth.resetPassword.confirmPasswordPlaceholder}
        />
      </div>
      <button 
        type="submit" 
        className={styles.button}
        disabled={loading}
      >
        {loading ? tr.common.submitting : tr.auth.resetPassword.submit}
      </button>
    </form>
  )
} 