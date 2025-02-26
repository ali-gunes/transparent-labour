import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface CompanyData {
  name: string
  averageSalary: number
  employeeCount: number
  experienceAvg: number
}

interface CompanyAnalyticsProps {
  data: CompanyData[]
}

export default function CompanyAnalytics({ data }: CompanyAnalyticsProps) {
  const [sortBy, setSortBy] = useState<'salary' | 'count' | 'experience'>('salary')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const sortedData = [...data]
    .sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return b.averageSalary - a.averageSalary
        case 'count':
          return b.employeeCount - a.employeeCount
        case 'experience':
          return b.experienceAvg - a.experienceAvg
      }
    })
    .slice(0, 10)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[32rem] text-gray-500 dark:text-gray-400">
        <p>Henüz yeterli veri bulunmamaktadır. En az 2 kayıt olan şirketler gösterilmektedir.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <select
          className="block w-48 px-3 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          defaultValue="salary"
          onChange={(e) => setSortBy(e.target.value as 'salary' | 'count' | 'experience')}
        >
          <option value="salary">Maaşa Göre</option>
          <option value="count">Çalışan Sayısına Göre</option>
          <option value="experience">Deneyime Göre</option>
        </select>
      </div>
      <div className="h-[32rem] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
            <YAxis
              dataKey="name"
              type="category"
              width={150}
              tick={{ fill: '#9CA3AF' }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'averageSalary') return [formatCurrency(value), 'Ortalama Maaş']
                if (name === 'employeeCount') return [value, 'Çalışan Sayısı']
                if (name === 'experienceAvg') return [`${value.toFixed(1)} yıl`, 'Ortalama Deneyim']
                return [value, name]
              }}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            <Bar
              dataKey="averageSalary"
              name="Ortalama Maaş"
              fill="#3B82F6"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="employeeCount"
              name="Çalışan Sayısı"
              fill="#10B981"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="experienceAvg"
              name="Ortalama Deneyim"
              fill="#F59E0B"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 