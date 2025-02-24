'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : tr.auth.errors.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.auth.forgotPassword.title}</h1>
      {error && <div className={styles.error}>{error}</div>}
      {success ? (
        <div className={styles.formCard}>
          <p className="text-green-600 dark:text-green-400">
            {tr.auth.forgotPassword.checkEmail}
          </p>
        </div>
      ) : (
        <div className={styles.formCard}>
          <form onSubmit={onSubmit} className={styles.formBody}>
            <div>
              <label htmlFor="email" className={styles.label}>
                {tr.auth.forgotPassword.email}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={styles.input}
                placeholder={tr.auth.forgotPassword.emailPlaceholder}
              />
            </div>
            <button 
              type="submit" 
              className={styles.button}
              disabled={loading}
            >
              {loading ? tr.common.submitting : tr.auth.forgotPassword.submit}
            </button>
          </form>
        </div>
      )}
    </div>
  )
} 