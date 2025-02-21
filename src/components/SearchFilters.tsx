'use client'

import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'

type SearchFiltersProps = {
  onFilterChange: (filters: {
    search: string
    minSalary: string
    maxSalary: string
  }) => void
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  return (
    <div className={`${styles.card} mb-6`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.text}>{tr.search.filters}</h2>
      </div>
      <div className={styles.cardBody}>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className={styles.label}>
              {tr.search.searchPlaceholder}
            </label>
            <input
              type="text"
              id="search"
              className={styles.input}
              onChange={(e) => 
                onFilterChange({
                  search: e.target.value,
                  minSalary: '',
                  maxSalary: ''
                })
              }
              placeholder={tr.search.searchPlaceholder}
            />
          </div>
          <div>
            <label htmlFor="minSalary" className={styles.label}>
              {tr.search.minSalary}
            </label>
            <input
              type="number"
              id="minSalary"
              className={styles.input}
              onChange={(e) =>
                onFilterChange({
                  search: '',
                  minSalary: e.target.value,
                  maxSalary: ''
                })
              }
              placeholder={tr.search.minSalary}
            />
          </div>
          <div>
            <label htmlFor="maxSalary" className={styles.label}>
              {tr.search.maxSalary}
            </label>
            <input
              type="number"
              id="maxSalary"
              className={styles.input}
              onChange={(e) =>
                onFilterChange({
                  search: '',
                  minSalary: '',
                  maxSalary: e.target.value
                })
              }
              placeholder={tr.search.maxSalary}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 