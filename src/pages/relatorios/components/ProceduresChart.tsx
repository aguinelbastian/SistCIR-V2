import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useReportData } from '@/hooks/use-report-data'
import { api } from '@/services/api'
import { ReportCard } from './ReportCard'
import { Activity } from 'lucide-react'

export function ProceduresChart() {
  const { data, loading, error, lastUpdated, refresh } = useReportData<any[]>(
    api.reports.procedimentos,
    30000,
  )

  const chartData = useMemo(() => {
    if (!data) return []
    return data.slice(0, 10).map((d) => ({
      name: d.procedimento || 'Não Informado',
      shortName: d.procedimento
        ? d.procedimento.length > 20
          ? d.procedimento.substring(0, 20) + '...'
          : d.procedimento
        : 'N/I',
      total: Number(d.total),
      realizadas: Number(d.realizadas),
      canceladas: Number(d.canceladas),
      taxa: Number(d.taxa_realizacao_pct).toFixed(1) + '%',
    }))
  }, [data])

  const config = {
    total: { label: 'Total de Pedidos', color: 'hsl(217, 91%, 60%)' },
    realizadas: { label: 'Realizadas', color: 'hsl(160, 84%, 39%)' },
  }

  return (
    <ReportCard
      title="Volume por Procedimento"
      icon={Activity}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {chartData.length > 0 ? (
        <ChartContainer config={config} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 10, bottom: 20 }}>
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
            <YAxis hide />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
              content={<ChartTooltipContent indicator="dashed" labelKey="name" />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="realizadas" fill="var(--color-realizadas)" radius={[4, 4, 0, 0]} />
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
