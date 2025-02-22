'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

export default function SignUp() {
  const router = useRouter()
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name')
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
        setError(result.error || 'Something went wrong')
        return
      }

      router.push('/login')
    } catch (err) {
      console.error('Signup failed:', err)
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.auth.signup.title}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.formCard}>
        <form onSubmit={onSubmit} className={styles.formBody}>
          <div>
            <label htmlFor="name" className={styles.label}>
              {tr.auth.signup.name}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={styles.input}
              placeholder={tr.auth.signup.namePlaceholder}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 italic">
                  {tr.auth.signup.nameNote}
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