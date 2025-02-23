'use client'

import { useState, useEffect } from 'react'
import SearchFilters from '@/components/SearchFilters'
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

export default function Search() {
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSalaries()
  }, [])

  async function fetchSalaries() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/salary')
      if (!res.ok) {
        throw new Error('Failed to fetch salaries')
      }
      const data = await res.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format')
      }
      setSalaries(data)
    } catch (error) {
      console.error('Failed to fetch salaries:', error)
      setError(tr.common.error)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(filters: {
    search: string
    minSalary: string
    maxSalary: string
    sortBy: string
  }) {
    let filtered = [...salaries]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (salary) =>
          salary.position.toLowerCase().includes(searchTerm) ||
          salary.company.toLowerCase().includes(searchTerm) ||
          salary.location.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.minSalary) {
      const minAmount = parseInt(filters.minSalary)
      filtered = filtered.filter((salary) => salary.salaryRange.min >= minAmount)
    }

    if (filters.maxSalary) {
      const maxAmount = parseInt(filters.maxSalary)
      filtered = filtered.filter((salary) => salary.salaryRange.max <= maxAmount)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'maxSalary':
          return b.salaryRange.max - a.salaryRange.max
        case 'minSalary':
          return a.salaryRange.min - b.salaryRange.min
        case 'mostVoted':
          return b.voteCount - a.voteCount
        default: // 'newest'
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setSalaries(filtered)
  }

  if (loading) {
    return <div className={styles.loading}>{tr.common.loading}</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>{tr.search.title}</h1>
      <SearchFilters onFilterChange={handleFilterChange} />
      <div className="grid gap-4">
        {Array.isArray(salaries) && salaries.map((salary) => (
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
                      <span className="block italic mt-1">&quot;{salary.sourceNote}&quot;</span>
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
        {salaries.length === 0 && (
          <p className={styles.textMuted}>{tr.search.noResults}</p>
        )}
      </div>
    </div>
  )
} 