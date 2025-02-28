import { useState, useEffect } from 'react'
import { commonStyles as styles } from '@/styles/common'
import KeyStatistics from './KeyStatistics'
import SalaryDistribution from './SalaryDistribution'
import CompanyAnalytics from './CompanyAnalytics'
import ExperienceAnalytics from './ExperienceAnalytics'
import { tr } from '@/translations/tr'

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
    companyFocusAnalytics: Array<{
      focus: string
      averageSalary: number
      employeeCount: number
      experienceAvg: number
    }>
    educationAnalytics: Array<{
      level: string
      averageSalary: number
      employeeCount: number
      experienceAvg: number
    }>
  } | null>(null)

  const fetchData = async (type: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/statistics?salaryType=${type}`)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(amount)
  }

  useEffect(() => {
    fetchData(salaryType)
  }, [salaryType])

  const handleSalaryTypeChange = (type: string) => {
    setSalaryType(type)
  }

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
          {/* <p className="mt-2 text-gray-600 dark:text-gray-300">
            Tüm maaş verilerinin detaylı analizi
          </p> */}
        </div>
        <div className="p-6">
          <KeyStatistics stats={data.stats} />
        </div>
      </div>

      <div className="grid gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Eğitim Seviyesi Analizi
            </h2>
          </div>
          <div className="p-2 md:p-6">
            {data.educationAnalytics && (
              <div className="overflow-x-auto relative">
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 pointer-events-none md:hidden" />
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Eğitim</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ort. Maaş</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Çalışan</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ort. Deneyim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.educationAnalytics.map((education) => (
                      <tr key={education.level} className="hover:bg-gray-50 hover:dark:bg-gray-700/50">
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {tr.search.educationLevels[education.level as keyof typeof tr.search.educationLevels]}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {formatCurrency(Math.round(education.averageSalary / 500) * 500)}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {education.employeeCount}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {education.experienceAvg.toFixed(1)} yıl
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Sektör Analizi
            </h2>
          </div>
          <div className="p-2 md:p-6">
            {data.companyFocusAnalytics && (
              <div className="overflow-x-auto relative">
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 pointer-events-none md:hidden" />
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sektör</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ort. Maaş</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Çalışan</th>
                      <th className="px-3 md:px-6 py-2 md:py-3 text-left text-[11px] md:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ort. Deneyim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {data.companyFocusAnalytics.map((focus) => (
                      <tr key={focus.focus} className="hover:bg-gray-50 hover:dark:bg-gray-700/50">
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {tr.submit.companyFocusTypes[focus.focus as keyof typeof tr.submit.companyFocusTypes]}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {formatCurrency(Math.round(focus.averageSalary / 500) * 500)}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {focus.employeeCount}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {focus.experienceAvg.toFixed(1)} yıl
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Maaş Dağılımı
              </h2>
              <select
                onChange={(e) => handleSalaryTypeChange(e.target.value)}
                className="block w-48 px-3 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                value={salaryType}
              >
                <option value="all">Tüm Kayıtlar</option>
                <option value="net">Net Maaş</option>
                <option value="gross">Brüt Maaş</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <SalaryDistribution data={data.distribution} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 mb-8">
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
      </div>

      

      

      <div className="grid md:grid-cols-1 gap-8">
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