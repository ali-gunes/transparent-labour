'use client'

import type { JSX } from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import SearchFilters from '@/components/SearchFilters'
import { commonStyles as styles } from '@/styles/common'
import { tr } from '@/translations/tr'
import VoteButtons from '@/components/VoteButtons'
import UserBadge from '@/components/UserBadge'
import Link from 'next/link'

type Salary = {
  id: string
  position: string
  company: string | null
  companyFocus: string | null
  amount: number
  salaryType: string
  experience: number
  location: string
  source: string
  sourceNote?: string
  createdAt: string
  rangeMin: number
  rangeMax: number
  submittedBy: string
  voteCount: number
  userVote?: number
  startDate: string
  endDate: string
  isCurrent: boolean
  workLifeBalance?: number
  compensationSatisfaction?: number
  salarySatisfaction?: number
  educationLevel?: string
  workType: string
  isSameLocation: boolean
  user: {
    totalVotes: number
    role: 'USER' | 'ADMIN'
    isEarlyAdapter: boolean
  }
}

type Filters = {
  search: string
  minSalary: string
  maxSalary: string
  sortBy: string
  salaryType: string
  minExperience: string
  maxExperience: string
  source: string
  startDate: Date | null
  endDate: Date | null
  companyFocus: string
  educationLevel: string
}

type PaginationInfo = {
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

export default function Search() {
  const { data: session } = useSession()
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  })

  const educationLevels = {
    HIGH_SCHOOL: 'Lise',
    ASSOCIATE: 'Ön Lisans',
    BACHELORS: 'Lisans',
    MASTERS: 'Yüksek Lisans',
    PHD: 'Doktora',
    OTHER: 'Diğer',
  }

  useEffect(() => {
    fetchSalaries()
  }, [filters, pagination.page])

  async function fetchSalaries() {
    setLoading(true)
    setError(null)
    try {
      // Build query params
      const params = new URLSearchParams()
      params.append('page', pagination.page.toString())
      params.append('limit', session ? '10' : '5') // Adjust limit based on auth status

      if (filters.search) params.append('search', filters.search)
      if (filters.minSalary) params.append('minSalary', filters.minSalary)
      if (filters.maxSalary) params.append('maxSalary', filters.maxSalary)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.salaryType !== 'all') params.append('salaryType', filters.salaryType)
      if (filters.minExperience) params.append('minExperience', filters.minExperience)
      if (filters.maxExperience) params.append('maxExperience', filters.maxExperience)
      if (filters.source !== 'all') params.append('source', filters.source)
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString())
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString())
      if (filters.educationLevel !== 'all') params.append('educationLevel', filters.educationLevel)
      if (filters.companyFocus) params.append('companyFocus', filters.companyFocus)

      const res = await fetch(`/api/salary?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch salaries')
      }
      const data = await res.json()
      setSalaries(data.salaries)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch salaries:', error)
      setError(tr.common.error)
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(newFilters: Filters) {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page when filters change
  }

  function handleLoadMore() {
    if (pagination.hasMore) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>{tr.search.title}</h1>
      <SearchFilters onFilterChange={handleFilterChange} isLoading={loading} />
      <div className="grid gap-4">
        {Array.isArray(salaries) && salaries.map((salary) => (
          <div key={salary.id} className={styles.card}>
            <div className={styles.cardBody}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className={`text-xl font-semibold ${styles.text}`}>
                    {salary.position}
                  </h2>
                  <p className={styles.textMuted}>
                    {salary.company || "Şirket Gizlenmiştir (Sektör: " + tr.submit.companyFocusTypes[salary.companyFocus as keyof typeof tr.submit.companyFocusTypes] + ")"}
                  </p>
                  <p className={`text-sm ${styles.textMuted}`}>
                    {salary.location.split(' -> ')[0]}
                  </p>
                </div>
                <span className={styles.textSmall}>
                  {new Date(salary.createdAt).toLocaleDateString("tr-TR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700"></div>
              <p className={`text-lg font-medium ${styles.text} mb-2`}>
                ₺{salary.rangeMin.toLocaleString()} - ₺{salary.rangeMax.toLocaleString()}
                <span className={styles.textSmall}> ({salary.salaryType === 'net' ? tr.submit.salaryTypes.net : tr.submit.salaryTypes.gross})</span>
              </p>
              {/* Add duration info */}
              <p className={`text-base font-medium ${styles.text} mb-2`}>
                {new Date(salary.startDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                {' - '}
                {salary.isCurrent
                  ? 'Devam ediyor'
                  : salary.endDate
                    ? new Date(salary.endDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                    : ''
                }
              </p>
              <div className="relative">
                <div className={styles.textSmall}>
                  <p className={`text-base font-medium ${styles.text} mb-2`}>{salary.experience} yıl deneyim</p>
                  <p className={`text-sm font-medium ${styles.text} mb-2`}>
                    {educationLevels[salary.educationLevel as keyof typeof educationLevels]} mezunu
                  </p>
                  <p className={`text-sm font-medium ${styles.text} mb-2`}>
                    {salary.workType === 'REMOTE'
                      ? 'Remote çalışıyor'
                      : salary.workType === 'HYBRID'
                        ? `${salary.location.split(' -> ')[0]}${['a', 'ı', 'o', 'u'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                            ? '\'da'
                            : ['e', 'i', 'ö', 'ü'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                              ? '\'de'
                              : '\'de'
                          } hibrit çalışıyor`
                        : `${salary.location.split(' -> ')[0]}${['a', 'ı', 'o', 'u'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                            ? '\'da'
                            : ['e', 'i', 'ö', 'ü'].includes(salary.location.split(' -> ')[0].slice(-1).toLowerCase())
                              ? '\'de'
                              : '\'de'
                          } ofisten çalışıyor`
                    }
                  </p>



                  {salary.source === 'SELF' && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${styles.text} mb-2`}>İş-Yaşam Dengesi:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= (salary.workLifeBalance || 0) ? "text-yellow-400" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${styles.text} mb-2`}>Yan Haklar:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= (salary.compensationSatisfaction || 0) ? "text-yellow-400" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${styles.text} mb-2`}>Maaş Memnuniyeti:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= (salary.salarySatisfaction || 0) ? "text-yellow-400" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700"></div>

                  <p className="mt-2">
                    {tr.profile.source}: {salary.source === 'SELF' ? tr.profile.sourceSelf : tr.profile.sourceOther}
                    {salary.sourceNote && (
                      <span className="block italic mt-1">&quot;{salary.sourceNote}&quot;</span>
                    )}
                  </p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {tr.profile.submittedBy}: {salary.submittedBy}
                    <UserBadge
                      voteCount={salary.user.totalVotes}
                      role={salary.user.role}
                      isEarlyAdapter={salary.user.isEarlyAdapter}
                    />
                  </p>
                </div>
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700"></div>
                <div className="mt-4 flex justify-center">
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
        {loading && (
          <div className={styles.loading}>{tr.common.loading}</div>
        )}
        {!loading && salaries.length === 0 && (
          <p className={styles.textMuted}>{tr.search.noResults}</p>
        )}
        {!loading && !session && salaries.length > 0 && (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Daha fazla maaş bilgisi görmek için giriş yapın
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </Link>
          </div>
        )}
        {!loading && session && pagination.hasMore && (
          <button
            onClick={handleLoadMore}
            className={`${styles.button} w-full`}
          >
            Daha Fazla Yükle
          </button>
        )}
      </div>
    </div>
  )
} 