import { useMemo } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { useReportData } from '@/hooks/use-report-data'
import { api } from '@/services/api'
import { ReportCard } from './ReportCard'
import { Filter } from 'lucide-react'

export function ConversionChart() {
  const { data, loading, error, lastUpdated, refresh } = useReportData<any>(
    api.reports.conversao,
    30000,
  )

  const chartData = useMemo(() => {
    if (!data) return []
    // Conversion needs a single row for stacked bar
    return [
      {
        name: 'Funil',
        rascunhos: Number(data.rascunhos || 0),
        em_processamento: Number(data.em_processamento || 0),
        autorizados: Number(data.autorizados || 0),
        em_execucao: Number(data.em_execucao || 0),
        realizados: Number(data.realizados || 0),
        cancelados: Number(data.cancelados || 0),
        total: Number(data.total_pedidos || 0),
      },
    ]
  }, [data])

  const config = {
    rascunhos: { label: 'Rascunhos', color: 'hsl(var(--muted-foreground))' },
    em_processamento: { label: 'Em Processamento', color: 'hsl(45, 93%, 47%)' },
    autorizados: { label: 'Autorizados', color: 'hsl(217, 91%, 60%)' },
    em_execucao: { label: 'Em Execução', color: 'hsl(262, 83%, 58%)' },
    realizados: { label: 'Realizados', color: 'hsl(142, 71%, 45%)' },
    cancelados: { label: 'Cancelados', color: 'hsl(0, 84%, 60%)' },
  }

  return (
    <ReportCard
      title="Funil de Conversão"
      icon={Filter}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {chartData[0] && chartData[0].total > 0 ? (
        <ChartContainer config={config} className="h-[250px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ top: 20, bottom: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" hideLabel />} />
            <Bar
              dataKey="rascunhos"
              stackId="a"
              fill="var(--color-rascunhos)"
              radius={[4, 0, 0, 4]}
            />
            <Bar dataKey="em_processamento" stackId="a" fill="var(--color-em_processamento)" />
            <Bar dataKey="autorizados" stackId="a" fill="var(--color-autorizados)" />
            <Bar dataKey="em_execucao" stackId="a" fill="var(--color-em_execucao)" />
            <Bar dataKey="realizados" stackId="a" fill="var(--color-realizados)" />
            <Bar
              dataKey="cancelados"
              stackId="a"
              fill="var(--color-cancelados)"
              radius={[0, 4, 4, 0]}
            />
            <ChartLegend content={<ChartLegendContent />} className="flex-wrap pt-6" />
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
