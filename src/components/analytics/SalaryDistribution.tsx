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
}

export default function SalaryDistribution({ data }: SalaryDistributionProps) {
  return (
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
  )
} 