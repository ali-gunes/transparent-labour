import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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
    // Add random variance between -7% and +7%
    const variance = 0.07 // 7%
    const randomFactor = 1 + (Math.random() * variance * 2 - variance)
    const variedAmount = amount * randomFactor
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency', 
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(variedAmount)
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[32rem] text-gray-500 dark:text-gray-400">
        <p>Henüz veri bulunmamaktadır.</p>
      </div>
    )
  }

  return (
    <div className="h-[32rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--grid-stroke)" 
          />
          <XAxis
            type="number"
            dataKey="experience"
            name="Deneyim"
            unit=" yıl"
            label={{
              value: 'Deneyim (Yıl)',
              position: 'bottom',
              className: 'fill-gray-900 dark:fill-white'
            }}
            tick={{ className: 'fill-gray-900 dark:fill-white' }}
            stroke="var(--axis-stroke)"
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
              className: 'fill-gray-900 dark:fill-white'
            }}
            tick={{ className: 'fill-gray-900 dark:fill-white' }}
            stroke="var(--axis-stroke)"
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'salary') return [formatCurrency(value), 'Maaş']
              if (name === 'experience') return [`${value} yıl`, 'Deneyim']
              return [value, name]
            }}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '0.375rem',
              color: 'var(--tooltip-text)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            cursor={{ strokeDasharray: '3 3' }}
            labelFormatter={(_, points) => {
              if (points && points[0]) {
                return `Pozisyon: ${(points[0].payload as SalaryPoint).position}`
              }
              return ''
            }}
          />
          <Scatter
            name="Maaş-Deneyim"
            data={data}
            fill="var(--scatter-fill)"
            stroke="var(--scatter-stroke)"
            fillOpacity={0.8}
            strokeWidth={1}
            shape="circle"
            r={6}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <style jsx global>{`
        :root {
          --tooltip-bg: #ffffff;
          --tooltip-border: #e5e7eb;
          --tooltip-text: #1f2937;
          --scatter-fill: #3b82f6;
          --scatter-stroke: #2563eb;
          --grid-stroke: #d1d5db;
          --axis-stroke: #111827;
        }
        .dark {
          --tooltip-bg: #1f2937;
          --tooltip-border: #374151;
          --tooltip-text: #f3f4f6;
          --scatter-fill: #60a5fa;
          --scatter-stroke: #3b82f6;
          --grid-stroke: #374151;
          --axis-stroke: #f9fafb;
        }
      `}</style>
    </div>
  )
} 