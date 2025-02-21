'use client'

import { useState, useEffect } from 'react'
import SearchFilters from '@/components/SearchFilters'
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

export default function Search() {
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [filteredSalaries, setFilteredSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalaries()
  }, [])

  async function fetchSalaries() {
    try {
      const res = await fetch('/api/salary')
      const data = await res.json()
      setSalaries(data)
      setFilteredSalaries(data)
    } catch (error) {
      console.error('Failed to fetch salaries:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(filters: {
    search: string
    minSalary: string
    maxSalary: string
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
      filtered = filtered.filter((salary) => salary.amount >= minAmount)
    }

    if (filters.maxSalary) {
      const maxAmount = parseInt(filters.maxSalary)
      filtered = filtered.filter((salary) => salary.amount <= maxAmount)
    }

    setFilteredSalaries(filtered)
  }

  if (loading) {
    return <div className={styles.loading}>{tr.common.loading}</div>
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>{tr.search.title}</h1>
      <SearchFilters onFilterChange={handleFilterChange} />
      <div className="grid gap-4">
        {filteredSalaries.map((salary) => (
          <div key={salary.id} className={styles.card}>
            <div className={styles.cardBody}>
              <h2 className={`text-xl font-semibold mb-2 ${styles.text}`}>
                {salary.position}
              </h2>
              <p className={`${styles.textMuted} mb-2`}>{salary.company}</p>
              <p className={`text-lg font-medium ${styles.text}`}>
                ${salary.salaryRange.min.toLocaleString()} - ${salary.salaryRange.max.toLocaleString()}
              </p>
              <div className={styles.textSmall}>
                <p>{salary.experience} {tr.search.yearsExp}</p>
                <p>{salary.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 