'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

export default function SubmitSalary() {
  const router = useRouter()
  const { status } = useSession()
  const [error, setError] = useState('')
  const [source, setSource] = useState('SELF')

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login')
    return null
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const amount = Number(formData.get('amount'))
    const experience = Number(formData.get('experience'))

    // Validate numbers
    if (isNaN(amount) || amount <= 0) {
      setError(tr.submit.validation.invalidSalary)
      return
    }

    if (isNaN(experience) || experience < 0) {
      setError(tr.submit.validation.invalidExperience)
      return
    }

    const data = {
      amount,
      position: formData.get('position'),
      company: formData.get('company'),
      experience,
      location: formData.get('location'),
      source: formData.get('source'),
      sourceNote: formData.get('sourceNote'),
    }

    try {
      const res = await fetch('/api/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/search')
        router.refresh()
      } else {
        const error = await res.json()
        setError(error.message || 'Something went wrong')
      }
    } catch (err) {
      console.error('Failed to submit salary:', err)
      setError('Something went wrong')
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.pageTitle}>{tr.submit.title}</h1>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      <div className={styles.formCard}>
        <form onSubmit={onSubmit} className={styles.formBody}>
          <div>
            <label htmlFor="amount" className={styles.label}>
              {tr.submit.salary}
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0"
              max="10000000"
              step="1000"
              onWheel={(e) => e.currentTarget.blur()}
              className={styles.input}
              placeholder={tr.submit.placeholders.salary}
            />
          </div>
          <div>
            <label htmlFor="position" className={styles.label}>
              {tr.submit.position}
            </label>
            <input
              type="text"
              id="position"
              name="position"
              required
              className={styles.input}
              placeholder={tr.submit.placeholders.position}
            />
          </div>
          <div>
            <label htmlFor="company" className={styles.label}>
              {tr.submit.company}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              className={styles.input}
              placeholder={tr.submit.placeholders.company}
            />
          </div>
          <div>
            <label htmlFor="experience" className={styles.label}>
              {tr.submit.experience}
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              required
              min="0"
              step="1"
              onWheel={(e) => e.currentTarget.blur()}
              className={styles.input}
              placeholder={tr.submit.placeholders.experience}
            />
          </div>
          <div>
            <label htmlFor="location" className={styles.label}>
              {tr.submit.location}
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className={styles.input}
              placeholder={tr.submit.placeholders.location}
            />
          </div>
          <div>
            <label htmlFor="source" className={styles.label}>
              {tr.submit.source}
            </label>
            <select
              id="source"
              name="source"
              className={styles.select}
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="SELF">{tr.submit.sourceTypes.self}</option>
              <option value="OTHER">{tr.submit.sourceTypes.other}</option>
            </select>
          </div>

          {source === 'OTHER' && (
            <div>
              <label htmlFor="sourceNote" className={styles.label}>
                {tr.submit.sourceNote}
              </label>
              <textarea
                id="sourceNote"
                name="sourceNote"
                className={styles.textarea}
                placeholder={tr.submit.sourceNotePlaceholder}
                rows={3}
              />
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
          >
            {tr.submit.submit}
          </button>
        </form>
      </div>
    </div>
  )
} 