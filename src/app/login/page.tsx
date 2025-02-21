'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.auth.login.title}</h1>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.formCard}>
        <form onSubmit={onSubmit} className={styles.formBody}>
          <div>
            <label htmlFor="email" className={styles.label}>
              {tr.auth.login.email}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              placeholder={tr.auth.login.emailPlaceholder}
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
          </div>
          <button type="submit" className={styles.button}>
            {tr.auth.login.submit}
          </button>
        </form>
      </div>
    </div>
  )
} 