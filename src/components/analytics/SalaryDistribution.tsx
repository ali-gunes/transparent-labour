import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface SalaryRange {
  range: string
  count: number
}

interface SalaryDistributionProps {
  data: SalaryRange[]
  onFilterChange?: (filter: string) => void
}

export default function SalaryDistribution({ data, onFilterChange }: SalaryDistributionProps) {
  return (
    <div>
      <div className="flex justify-end mb-6">
        <select
          onChange={(e) => onFilterChange?.(e.target.value)}
          className="block w-48 px-3 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          defaultValue="all"
        >
          <option value="all">Tüm Kayıtlar</option>
          <option value="net">Net Maaş</option>
          <option value="gross">Brüt Maaş</option>
        </select>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="range"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip
              formatter={(value: number) => [`${value} Kayıt`, 'Kayıt Sayısı']}
              labelFormatter={(label) => `Maaş Aralığı: ${label}`}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.375rem',
                color: '#F3F4F6'
              }}
            />
            <Bar
              dataKey="count"
              fill="#3B82F6"
              name="Kayıt Sayısı"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 