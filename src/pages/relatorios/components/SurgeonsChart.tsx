import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useReportData } from '@/hooks/use-report-data'
import { api } from '@/services/api'
import { ReportCard } from './ReportCard'
import { BarChart3 } from 'lucide-react'

export function SurgeonsChart() {
  const { data, loading, error, lastUpdated, refresh } = useReportData<any[]>(
    api.reports.cirurgioes,
    30000,
  )

  const chartData = useMemo(() => {
    if (!data) return []
    return data.slice(0, 10).map((d) => ({
      name: d.cirurgiao || 'Não Informado',
      total: Number(d.total_cirurgias),
      realizadas: Number(d.realizadas),
      canceladas: Number(d.canceladas),
      taxa_cancelamento: Number(d.taxa_cancelamento_pct).toFixed(1) + '%',
    }))
  }, [data])

  const config = {
    total: { label: 'Total de Pedidos', color: 'hsl(var(--primary))' },
    realizadas: { label: 'Realizadas', color: 'hsl(142, 71%, 45%)' },
    canceladas: { label: 'Canceladas', color: 'hsl(0, 84%, 60%)' },
  }

  return (
    <ReportCard
      title="Volume por Cirurgião (Top 10)"
      icon={BarChart3}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {chartData.length > 0 ? (
        <ChartContainer config={config} className="h-[300px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              width={120}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(v) => (
                    <span className="font-bold text-foreground block mb-1">{v}</span>
                  )}
                  formatter={(value, name, item) => (
                    <div className="flex justify-between w-full min-w-[120px] text-xs">
                      <span className="text-muted-foreground">
                        {config[name as keyof typeof config]?.label}:
                      </span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              dataKey="realizadas"
              stackId="a"
              fill="var(--color-realizadas)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="canceladas"
              stackId="a"
              fill="var(--color-canceladas)"
              radius={[0, 0, 0, 0]}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} opacity={0} />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Sem dados disponíveis
        </div>
      )}
    </ReportCard>
  )
}
