'use client'

import { useState } from 'react'
import { tr } from '@/translations/tr'
import { commonStyles as styles } from '@/styles/common'

type SortOption = 'newest' | 'maxSalary' | 'minSalary' | 'mostVoted'

type Filters = {
  search: string
  minSalary: string
  maxSalary: string
  sortBy: SortOption
}

type SearchFiltersProps = {
  onFilterChange: (filters: Filters) => void
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    minSalary: '',
    maxSalary: '',
    sortBy: 'newest'
  })

  function handleChange(key: keyof Filters, value: string) {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">{tr.search.filters}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          placeholder={tr.search.searchPlaceholder}
          className={styles.input}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        <input
          type="number"
          placeholder={tr.search.minSalary}
          className={styles.input}
          onChange={(e) => handleChange('minSalary', e.target.value)}
        />
        <input
          type="number"
          placeholder={tr.search.maxSalary}
          className={styles.input}
          onChange={(e) => handleChange('maxSalary', e.target.value)}
        />
        <select
          className={styles.select}
          onChange={(e) => handleChange('sortBy', e.target.value as SortOption)}
          value={filters.sortBy}
        >
          <option value="newest">{tr.search.sort.newest}</option>
          <option value="maxSalary">{tr.search.sort.maxSalary}</option>
          <option value="minSalary">{tr.search.sort.minSalary}</option>
          <option value="mostVoted">{tr.search.sort.mostVoted}</option>
        </select>
      </div>
    </div>
  )
} 