'use client'

import { useSession } from 'next-auth/react'
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
  salaryRange: {
    min: number
    max: number
  }
}

export default function Home() {
  const { data: session } = useSession()
  const [latestSalaries, setLatestSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetchLatestSalaries()
    }
  }, [session])

  async function fetchLatestSalaries() {
    setLoading(true)
    try {
      const res = await fetch('/api/salary?limit=5')
      const data = await res.json()
      setLatestSalaries(data)
    } catch (error) {
      console.error('Failed to fetch salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            {tr.home.welcome}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {tr.home.subtitle}
          </p>
        </section>
        
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{tr.home.howItWorks}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">{tr.home.step1}</h3>
              <p className="text-gray-600 dark:text-gray-300">{tr.home.step1Desc}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">{tr.home.step2}</h3>
              <p className="text-gray-600 dark:text-gray-300">{tr.home.step2Desc}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">{tr.home.step3}</h3>
              <p className="text-gray-600 dark:text-gray-300">{tr.home.step3Desc}</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className={styles.pageTitle}>Son Emek Paylaşımları</h1>
        {loading ? (
          <div className={styles.loading}>{tr.common.loading}</div>
        ) : (
          <div className="grid gap-4">
            {latestSalaries.map((salary) => (
              <div key={salary.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <h2 className={`text-xl font-semibold mb-2 ${styles.text}`}>
                    {salary.position}
                  </h2>
                  <p className={`${styles.textMuted} mb-2`}>{salary.company}</p>
                  <p className={`text-lg font-medium ${styles.text}`}>
                    ₺{salary.salaryRange.min.toLocaleString()} - ₺{salary.salaryRange.max.toLocaleString()}
                  </p>
                  <div className={styles.textSmall}>
                    <p>{salary.experience} {tr.search.yearsExp}</p>
                    <p>{salary.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
} 