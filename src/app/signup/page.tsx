'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import { hashPassword } from '@/lib/hash'
import { isValidUsername } from '@/lib/validation'

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState('')

  function validateForm(formData: FormData) {
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (password.length < 8) {
      return tr.auth.errors.weakPassword
    }

    const usernameValidation = isValidUsername(username)
    if (!usernameValidation.isValid) {
      return usernameValidation.reason
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return tr.auth.errors.invalidEmail
    }

    return null
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    
    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      return
    }

    const data = {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: hashPassword(formData.get('password') as string),
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || tr.common.error)
        return
      }

      router.push('/verify-notice')
    } catch (err) {
      console.error('Signup failed:', err)
      setError(tr.common.error)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.auth.signup.title}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.formCard}>
        <form onSubmit={onSubmit} className={styles.formBody}>
          <div>
            <label htmlFor="username" className={styles.label}>
              {tr.auth.signup.username}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className={styles.input}
              placeholder={tr.auth.signup.usernamePlaceholder}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
              {tr.auth.signup.usernameNote}
            </p>
          </div>
          <div>
            <label htmlFor="email" className={styles.label}>
              {tr.auth.signup.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              placeholder={tr.auth.signup.emailPlaceholder}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
              {tr.auth.signup.emailNote}
            </p>
          </div>
          <div>
            <label htmlFor="password" className={styles.label}>
              {tr.auth.signup.password}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className={styles.input}
              placeholder={tr.auth.signup.passwordPlaceholder}
            />
          </div>
          <button type="submit" className={styles.button}>
            {tr.auth.signup.submit}
          </button>
        </form>
      </div>
    </div>
  )
} 