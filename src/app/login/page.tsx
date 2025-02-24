'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const username = formData.get('username') as string
      const password = formData.get('password') as string

      console.log('Attempting login with:', { username })

      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      console.log('Login result:', result)

      if (result?.error) {
        setError(result.error)
        return
      }

      router.push('/')
    } catch (err) {
      console.error('Login failed:', err)
      setError(tr.auth.errors.unexpectedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.auth.login.title}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.formCard}>
        <form onSubmit={onSubmit} className={styles.formBody}>
          <div>
            <label htmlFor="username" className={styles.label}>
              {tr.auth.login.username}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className={styles.input}
              placeholder={tr.auth.login.usernamePlaceholder}
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>
              {tr.auth.login.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className={styles.input}
              placeholder={tr.auth.login.passwordPlaceholder}
            />
            <div className="mt-2 text-sm">
              <Link 
                href="/forgot-password" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {tr.auth.login.forgotPassword}
              </Link>
            </div>
          </div>
          <button 
            type="submit" 
            className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
            disabled={loading}
          >
            {loading ? tr.auth.login.loading : tr.auth.login.submit}
          </button>
        </form>
      </div>
    </div>
  )
} 