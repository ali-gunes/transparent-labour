'use client'

import { useState, useEffect, useCallback } from 'react'
import { tr } from '@/translations/tr'
import { commonStyles as styles } from '@/styles/common'
import debounce from 'lodash/debounce'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

type SortOption = 'newest' | 'maxSalary' | 'minSalary' | 'mostVoted'
type SalaryType = 'all' | 'net' | 'gross'
type SourceType = 'all' | 'SELF' | 'OTHER'
type CompanyFocusType = 'TECHNOLOGY' | 'BANKING' | 'FINANCE' | 'MANUFACTURING' | 'DEFENSE' | 'LOGISTICS' | 'RETAIL' | 'HEALTHCARE' | 'EDUCATION' | 'CONSULTING' | 'TELECOM' | 'ENERGY' | 'AUTOMOTIVE' | 'ECOMMERCE' | 'GAMING' | 'MEDIA' | 'OTHER'

type Filters = {
  search: string
  minSalary: string
  maxSalary: string
  sortBy: SortOption
  salaryType: SalaryType
  minExperience: string
  maxExperience: string
  source: SourceType
  startDate: Date | null
  endDate: Date | null
  companyFocus: string
  educationLevel: string
}

type SearchFiltersProps = {
  onFilterChange: (filters: Filters) => void
  isLoading?: boolean
}

export default function SearchFilters({ onFilterChange, isLoading }: SearchFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    minSalary: '',
    maxSalary: '',
    sortBy: 'newest',
    salaryType: 'all',
    minExperience: '',
    maxExperience: '',
    source: 'all',
    startDate: null,
    endDate: null,
    companyFocus: '',
    educationLevel: 'all'
  })

  // Create a debounced version of onFilterChange
  const debouncedFilterChange = useCallback(
    debounce((newFilters: Filters) => {
      onFilterChange(newFilters)
    }, 300),
    [onFilterChange]
  )

  // Update URL with current filters
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== 'newest') {
        if (value instanceof Date) {
          params.set(key, value.toISOString())
        } else {
          params.set(key, value)
        }
      }
    })
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
  }, [filters])

  // Initialize filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const newFilters = {} as Record<keyof Filters, any>

    params.forEach((value, key) => {
      if (key in filters) {
        if (key === 'startDate' || key === 'endDate') {
          try {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              newFilters[key as keyof Filters] = date
            }
          } catch {
            newFilters[key as keyof Filters] = null
          }
        } else {
          newFilters[key as keyof Filters] = value
        }
      }
    })

    if (Object.keys(newFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...newFilters }))
      onFilterChange({ ...filters, ...newFilters })
    }
  }, [])

  function handleChange(key: keyof Filters, value: any) {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    debouncedFilterChange(newFilters)
  }

  function handleClearFilters() {
    const defaultFilters: Filters = {
      search: '',
      minSalary: '',
      maxSalary: '',
      sortBy: 'newest',
      salaryType: 'all',
      minExperience: '',
      maxExperience: '',
      source: 'all',
      startDate: null,
      endDate: null,
      companyFocus: '',
      educationLevel: 'all'
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-l font-bold text-gray-800 dark:text-white">{tr.search.filters}</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          disabled={isLoading}
        >
          {tr.search.clearFilters}
        </button>
      </div>

      <div className="space-y-6">
        {/* Search Input */}
        <div>
          <label className={styles.label}>Arama</label>
          <input
            type="text"
            placeholder={tr.search.searchPlaceholder}
            className={styles.input}
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Salary Range */}
        <div>
          <label className={styles.label}>Maaş Aralığı</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={tr.search.minSalary}
              className={styles.input}
              value={filters.minSalary}
              onChange={(e) => handleChange('minSalary', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="number"
              placeholder={tr.search.maxSalary}
              className={styles.input}
              value={filters.maxSalary}
              onChange={(e) => handleChange('maxSalary', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Salary Type and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryType" className={styles.label}>
              Maaş Türü
            </label>
            <select
              className={styles.select}
              value={filters.salaryType}
              onChange={(e) => handleChange('salaryType', e.target.value as SalaryType)}
              disabled={isLoading}
            >
              <option value="all">{tr.search.salaryType.all}</option>
              <option value="net">{tr.search.salaryType.net}</option>
              <option value="gross">{tr.search.salaryType.gross}</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortBy" className={styles.label}>
              Sıralama
            </label>
            <select
              className={styles.select}
              value={filters.sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value as SortOption)}
              disabled={isLoading}
            >
              <option value="newest">{tr.search.sort.newest}</option>
              <option value="maxSalary">{tr.search.sort.maxSalary}</option>
              <option value="minSalary">{tr.search.sort.minSalary}</option>
              <option value="mostVoted">{tr.search.sort.mostVoted}</option>
            </select>
          </div>
        </div>

        {/* Experience Range */}
        <div>
          <label className={styles.label}>Deneyim Aralığı (Yıl)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={tr.search.minExperience}
              className={styles.input}
              value={filters.minExperience}
              onChange={(e) => handleChange('minExperience', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="number"
              placeholder={tr.search.maxExperience}
              className={styles.input}
              value={filters.maxExperience}
              onChange={(e) => handleChange('maxExperience', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className={styles.label}>Tarih Aralığı</label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => handleChange('startDate', date)}
              className={styles.input}
              placeholderText={tr.search.startDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              disabled={isLoading}
            />
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => handleChange('endDate', date)}
              className={styles.input}
              placeholderText={tr.search.endDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Company Focus and Education Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyFocus" className={styles.label}>
              {tr.search.companyFocus.label}
            </label>
            <select
              id="companyFocus"
              className={styles.select}
              value={filters.companyFocus}
              onChange={(e) => handleChange('companyFocus', e.target.value)}
              disabled={isLoading}
            >
              <option value="">{tr.search.companyFocus.all}</option>
              {(Object.keys(tr.submit.companyFocusTypes) as Array<CompanyFocusType>).map((key) => (
                <option key={key} value={key}>
                  {tr.submit.companyFocusTypes[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="educationLevel" className={styles.label}>
              {tr.search.educationLevel}
            </label>
            <select
              id="educationLevel"
              className={styles.select}
              value={filters.educationLevel}
              onChange={(e) => handleChange('educationLevel', e.target.value)}
              disabled={isLoading}
            >
              {Object.entries(tr.search.educationLevels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
} 