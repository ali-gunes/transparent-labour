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
          className="block w-48 px-3 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-gray-800 dark:text-white"
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
            margin={{ top: 20, right: 30, left: 0, bottom: 120 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke)" />
            <XAxis 
              dataKey="name"
              type="category"
              tick={(props) => {
                const { x, y, payload } = props;
                return (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={16}
                      textAnchor="end"
                      transform="rotate(-45)"
                      className="fill-gray-800 dark:fill-gray-300"
                    >
                      {payload.value}
                    </text>
                  </g>
                );
              }}
              height={100}
              stroke="var(--axis-stroke)"
            />
            <YAxis
              type="number"
              yAxisId="salary"
              hide
            />
            <YAxis
              type="number"
              yAxisId="count"
              orientation="right"
              hide
            />
            <YAxis
              type="number"
              yAxisId="experience"
              orientation="right"
              hide
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                switch (name) {
                  case 'averageSalary':
                    return [formatCurrency(value), 'Ortalama Maaş']
                  case 'employeeCount':
                    return [value, 'Çalışan Sayısı']
                  case 'experienceAvg':
                    return [`${value.toFixed(1)} yıl`, 'Ortalama Deneyim']
                  default:
                    return [value, name]
                }
              }}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg)',
                border: '1px solid var(--tooltip-border)',
                borderRadius: '0.375rem',
                color: 'var(--tooltip-text)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
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
              radius={[4, 4, 0, 0]}
              yAxisId="salary"
            />
            <Bar
              dataKey="employeeCount"
              name="Çalışan Sayısı"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
              yAxisId="count"
            />
            <Bar
              dataKey="experienceAvg"
              name="Ortalama Deneyim"
              fill="#F59E0B"
              radius={[4, 4, 0, 0]}
              yAxisId="experience"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <style jsx global>{`
        :root {
          --tooltip-bg: #ffffff;
          --tooltip-border: #e5e7eb;
          --tooltip-text: #1f2937;
          --grid-stroke: #d1d5db;
          --axis-stroke: #9ca3af;
        }
        .dark {
          --tooltip-bg: #1f2937;
          --tooltip-border: #374151;
          --tooltip-text: #f3f4f6;
          --grid-stroke: #374151;
          --axis-stroke: #4b5563;
        }
      `}</style>
    </div>
  )
} 