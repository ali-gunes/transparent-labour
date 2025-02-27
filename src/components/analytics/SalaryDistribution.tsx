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
  console.log('SalaryDistribution data:', data)

  if (!data || data.length === 0) {
    console.log('No data available for distribution')
    return (
      <div className="h-[32rem] w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Bu filtreye uygun veri bulunamadı
      </div>
    )
  }

  // Log individual data points
  data.forEach((item, index) => {
    console.log(`Data point ${index}:`, item)
  })

  // Calculate max count for YAxis domain
  const maxCount = Math.max(...data.map(d => d.count))
  // Ensure we show at least up to 5 on the Y axis
  const yAxisMax = Math.max(maxCount, 5)

  console.log('Y-axis max:', yAxisMax)

  return (
    <div className="h-[32rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 40, right: 30, left: 30, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="range"
            angle={-45}
            textAnchor="end"
            height={120}
            interval={0}
            tick={{ 
              fill: '#9CA3AF',
              fontSize: 14
            }}
            dy={20}
          />
          <YAxis 
            tick={{ 
              fill: '#9CA3AF',
              fontSize: 14
            }}
            dx={-10}
            tickCount={Math.min(10, yAxisMax + 1)}
            domain={[0, yAxisMax]}
          />
          <Tooltip
            formatter={(value: number) => [`${value} Kayıt`, 'Kayıt Sayısı']}
            labelFormatter={(label) => `Maaş Aralığı: ${label}`}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.375rem',
              color: '#F3F4F6',
              fontSize: '14px',
              padding: '8px 12px'
            }}
          />
          <Bar
            dataKey="count"
            fill="#3B82F6"
            name="Kayıt Sayısı"
            radius={[4, 4, 0, 0]}
            minPointSize={5}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 