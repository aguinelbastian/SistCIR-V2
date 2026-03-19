import { useMemo } from 'react'
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useReportData } from '@/hooks/use-report-data'
import { api } from '@/services/api'
import { ReportCard } from './ReportCard'
import { Clock } from 'lucide-react'

export function LeadTimeChart() {
  const { data, loading, error, lastUpdated, refresh } = useReportData<any[]>(
    api.reports.tempoAutorizacao,
    30000,
  )

  const chartData = useMemo(() => {
    if (!data) return []
    return data
      .filter((d) => d.tempo_medio_horas != null)
      .slice(0, 15)
      .map((d) => ({
        name: d.cirurgiao || 'Não Informado',
        shortName: d.cirurgiao ? d.cirurgiao.split(' ').slice(0, 2).join(' ') : 'N/I',
        medio: Number(Number(d.tempo_medio_horas).toFixed(1)),
        minimo: Number(Number(d.tempo_minimo_horas).toFixed(1)),
        maximo: Number(Number(d.tempo_maximo_horas).toFixed(1)),
        total: Number(d.total_pedidos),
      }))
  }, [data])

  const config = {
    medio: { label: 'Tempo Médio (Horas)', color: 'hsl(var(--primary))' },
    minimo: { label: 'Tempo Mínimo', color: 'hsl(142, 71%, 45%)' },
    maximo: { label: 'Tempo Máximo', color: 'hsl(0, 84%, 60%)' },
    total: { label: 'Qtd. Pedidos', color: 'hsl(var(--muted-foreground))' },
  }

  return (
    <ReportCard
      title="Tempo Médio de Autorização (Horas)"
      icon={Clock}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {chartData.length > 0 ? (
        <ChartContainer config={config} className="h-[300px] w-full">
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="shortName"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" labelKey="name" />} />
            <Line
              type="monotone"
              dataKey="medio"
              stroke="var(--color-medio)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--color-medio)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Sem dados disponíveis
        </div>
      )}
    </ReportCard>
  )
}
