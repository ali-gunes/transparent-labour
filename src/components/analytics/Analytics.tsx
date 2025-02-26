import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'
import KeyStatistics from './KeyStatistics'
import SalaryDistribution from './SalaryDistribution'
import CompanyAnalytics from './CompanyAnalytics'
import ExperienceAnalytics from './ExperienceAnalytics'

export default function Analytics() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [salaryType, setSalaryType] = useState('all')
  const [data, setData] = useState<{
    stats: {
      averageSalary: number
      totalEntries: number
      topPosition: string
      topCompany: string
      medianSalary: number
    }
    distribution: Array<{
      range: string
      count: number
    }>
    companyAnalytics: Array<{
      name: string
      averageSalary: number
      employeeCount: number
      experienceAvg: number
    }>
    experienceAnalytics: Array<{
      experience: number
      salary: number
      position: string
    }>
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/statistics?salaryType=${salaryType}`)
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [salaryType])

  if (loading) {
    return (
      <div className={styles.loading}>Yükleniyor...</div>
    )
  }

  if (error) {
    return (
      <div className={styles.error}>
        Hata: {error}
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="border-b border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Maaş İstatistikleri
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Tüm maaş verilerinin detaylı analizi
          </p>
        </div>
        <div className="p-6">
          <KeyStatistics stats={data.stats} />
        </div>
      </div>

      <div className="grid gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Maaş Dağılımı
            </h2>
          </div>
          <div className="p-6">
            <SalaryDistribution
              data={data.distribution}
              onFilterChange={(value) => setSalaryType(value)}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Şirket Analizi
            </h2>
          </div>
          <div className="p-6">
            <CompanyAnalytics data={data.companyAnalytics} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Deneyim Analizi
            </h2>
          </div>
          <div className="p-6">
            <ExperienceAnalytics data={data.experienceAnalytics} />
          </div>
        </div>
      </div>
    </div>
  )
} 