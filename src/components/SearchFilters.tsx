'use client'

import { useState, useEffect, useCallback } from 'react'
import { tr } from '@/translations/tr'
import { commonStyles as styles } from '@/styles/common'
import debounce from 'lodash/debounce'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

type SortOption = 'newest' | 'maxSalary' | 'minSalary' | 'mostVoted' | 'maxEducation' | 'maxExperience'
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
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [localFilters, setLocalFilters] = useState(filters)

  // Create a debounced version of onFilterChange
  const debouncedFilterChange = useCallback(
    debounce((newFilters: Filters) => {
      onFilterChange(newFilters)
    }, 300),
    [onFilterChange]
  )

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
      setLocalFilters(prev => ({ ...prev, ...newFilters }))
      onFilterChange({ ...filters, ...newFilters })
    }
  }, [])

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

  function handleLocalChange(key: keyof Filters, value: any) {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  function handleApplyFilters() {
    setFilters(localFilters)
    onFilterChange(localFilters)
  }

  function handleClearFilters() {
    const defaultFilters: Filters = {
      search: '',
      minSalary: '',
      maxSalary: '',
      sortBy: 'newest',
      salaryType: 'net',
      minExperience: '',
      maxExperience: '',
      source: 'all',
      startDate: null,
      endDate: null,
      companyFocus: '',
      educationLevel: 'all'
    }
    setFilters(defaultFilters)
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-l font-bold text-gray-800 dark:text-white">{tr.search.filters}</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isCollapsed ? 'Expand filters' : 'Collapse filters'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            disabled={isLoading}
          >
            {tr.search.clearFilters}
          </button>
        </div>
      </div>

      <div className={`space-y-6 ${isCollapsed ? 'hidden md:block' : 'block'}`}>
        {/* Search Input */}
        <div>
          <label className={styles.label}>Arama</label>
          <input
            type="text"
            placeholder={tr.search.searchPlaceholder}
            className={styles.input}
            value={localFilters.search}
            onChange={(e) => handleLocalChange('search', e.target.value)}
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
              value={localFilters.minSalary}
              onChange={(e) => handleLocalChange('minSalary', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="number"
              placeholder={tr.search.maxSalary}
              className={styles.input}
              value={localFilters.maxSalary}
              onChange={(e) => handleLocalChange('maxSalary', e.target.value)}
              disabled={isLoading}
            />
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
              value={localFilters.minExperience}
              onChange={(e) => handleLocalChange('minExperience', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="number"
              placeholder={tr.search.maxExperience}
              className={styles.input}
              value={localFilters.maxExperience}
              onChange={(e) => handleLocalChange('maxExperience', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className={styles.label}>Tarih Aralığı</label>
          <div className="grid grid-cols-2 gap-2">
            <DatePicker
              selected={localFilters.startDate}
              onChange={(date) => handleLocalChange('startDate', date)}
              className={styles.input}
              placeholderText={tr.search.startDate}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              disabled={isLoading}
            />
            <DatePicker
              selected={localFilters.endDate}
              onChange={(date) => handleLocalChange('endDate', date)}
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
              value={localFilters.companyFocus}
              onChange={(e) => handleLocalChange('companyFocus', e.target.value)}
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
              value={localFilters.educationLevel}
              onChange={(e) => handleLocalChange('educationLevel', e.target.value)}
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

        {/* Salary Type and Sort */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="salaryType" className={styles.label}>
              Maaş Türü
            </label>
            <select
              className={styles.select}
              value={localFilters.salaryType}
              onChange={(e) => handleLocalChange('salaryType', e.target.value as SalaryType)}
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
              value={localFilters.sortBy}
              onChange={(e) => handleLocalChange('sortBy', e.target.value as SortOption)}
              disabled={isLoading}
            >
              <option value="newest">{tr.search.sort.newest}</option>
              <option value="maxSalary">{tr.search.sort.maxSalary}</option>
              <option value="minSalary">{tr.search.sort.minSalary}</option>
              <option value="mostVoted">{tr.search.sort.mostVoted}</option>
              <option value="maxEducation">En Yüksek Eğitim</option>
              <option value="maxExperience">En Yüksek Deneyim</option>
            </select>
          </div>
        </div>

        {/* Apply Filters Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleApplyFilters}
            disabled={isLoading}
            className={`${styles.button} px-6 py-2`}
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>
    </div>
  )
} 