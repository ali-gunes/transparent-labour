'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

type Salary = {
  id: string
  position: string
  company: string
  amount: number
  experience: number
  location: string
  source: string
  sourceNote?: string
  createdAt: string
  salaryRange: {
    min: number
    max: number
  }
}

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (session) {
      fetchUserSalaries()
    }
  }, [session, status, router])

  async function fetchUserSalaries() {
    try {
      const res = await fetch('/api/salary/user')
      const data = await res.json()
      setSalaries(data)
    } catch (error) {
      console.error('Failed to fetch user salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>{tr.common.loading}</div>
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>{tr.profile.title}</h1>
      <div className="grid gap-4">
        {salaries.map((salary) => (
          <div key={salary.id} className={styles.card}>
            <div className={styles.cardBody}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className={`text-xl font-semibold ${styles.text}`}>
                    {salary.position}
                  </h2>
                  <p className={styles.textMuted}>{salary.company}</p>
                </div>
                <span className={styles.textSmall}>
                  {new Date(salary.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-lg font-medium ${styles.text} mb-2`}>
                ${salary.salaryRange.min.toLocaleString()} - ${salary.salaryRange.max.toLocaleString()}
              </p>
              <div className={styles.textSmall}>
                <p>{salary.experience} {tr.search.yearsExp}</p>
                <p>{salary.location}</p>
                <p className="mt-2">
                  {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                  {salary.sourceNote && (
                    <span className="block italic mt-1">{salary.sourceNote}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 