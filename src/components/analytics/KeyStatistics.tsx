import { Grid } from '@tremor/react'

interface StatCardProps {
  title: string
  metric: string | number
  description?: string
}

const StatCard = ({ title, metric, description }: StatCardProps) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
    <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
      {title}
    </h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
      {metric}
    </p>
    {description && (
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    )}
  </div>
)

interface KeyStatisticsProps {
  stats: {
    averageSalary: number
    totalEntries: number
    topPosition: string
    topCompany: string
    medianSalary: number
  }
}

export default function KeyStatistics({ stats }: KeyStatisticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
      <StatCard
        title="Ortalama Maaş"
        metric={formatCurrency(stats.averageSalary)}
        description="Tüm kayıtların aylık ortalama maaşı"
      />
      <StatCard
        title="Medyan Maaş"
        metric={formatCurrency(stats.medianSalary)}
        description="Tüm kayıtların aylık medyan maaşı"
      />
      <StatCard
        title="Toplam Kayıt"
        metric={stats.totalEntries}
        description="Veritabanındaki toplam maaş kaydı sayısı"
      />
      <StatCard
        title="En Yaygın Pozisyon"
        metric={stats.topPosition}
        description="En çok girilen pozisyon"
      />
      <StatCard
        title="En Çok Kayıt Olan Şirket"
        metric={stats.topCompany}
        description="En fazla maaş kaydı olan şirket"
      />
    </Grid>
  )
} 