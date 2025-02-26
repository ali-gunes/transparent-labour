import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface SalaryPoint {
  experience: number
  salary: number
  position: string
}

interface ExperienceAnalyticsProps {
  data: SalaryPoint[]
}

export default function ExperienceAnalytics({ data }: ExperienceAnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="h-[32rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            type="number"
            dataKey="experience"
            name="Deneyim"
            unit=" yıl"
            label={{
              value: 'Deneyim (Yıl)',
              position: 'bottom',
              fill: '#9CA3AF'
            }}
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            type="number"
            dataKey="salary"
            name="Maaş"
            tickFormatter={(value) => `${(value / 1000)}k`}
            label={{
              value: 'Maaş (TL)',
              angle: -90,
              position: 'left',
              fill: '#9CA3AF'
            }}
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'salary') return [formatCurrency(value), 'Maaş']
              if (name === 'experience') return [`${value} yıl`, 'Deneyim']
              return [value, name]
            }}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#F3F4F6'
            }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter
            name="Maaş-Deneyim"
            data={data}
            fill="#3B82F6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
} 