'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import VoteButtons from '@/components/VoteButtons'

type Salary = {
  id: string
  position: string
  company: string
  amount: number
  salaryType: string
  experience: number
  location: string
  source: string
  sourceNote?: string
  createdAt: string
  salaryRange: {
    min: number
    max: number
  }
  submittedBy: string
  voteCount: number
  userVote?: number
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
      const res = await fetch('/api/salary?limit=20')
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
        {Array.isArray(latestSalaries) && latestSalaries.map((salary) => (
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
                ₺{salary.salaryRange.min.toLocaleString()} - ₺{salary.salaryRange.max.toLocaleString()}
                <span className={styles.textSmall}> ({salary.salaryType === 'net' ? tr.submit.salaryTypes.net : tr.submit.salaryTypes.gross})</span>
              </p>
              <div className="relative">
                <div className={styles.textSmall}>
                  <p>{salary.experience} {tr.search.yearsExp}</p>
                  <p>{salary.location}</p>
                  <p className="mt-2">
                    {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                    {salary.sourceNote && (
                      <span className="block italic mt-1">"{salary.sourceNote}"</span>
                    )}
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {tr.profile.submittedBy}: {salary.submittedBy}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0">
                  <VoteButtons
                    salaryId={salary.id}
                    initialVoteCount={salary.voteCount}
                    initialVote={salary.userVote}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {latestSalaries.length === 0 && (
          <p className={styles.textMuted}>{tr.search.noResults}</p>
        )}
      </div>
        )}
      </section>
    </div>
  )
} 