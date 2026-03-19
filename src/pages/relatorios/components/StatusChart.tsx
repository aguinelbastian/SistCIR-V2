import { useMemo } from 'react'
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts'
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
import { PieChart as PieChartIcon } from 'lucide-react'

// Clean label e.g., "1_RASCUNHO" -> "Rascunho"
const cleanStatus = (s: string) => {
  if (!s) return 'Desconhecido'
  const parts = s.split('_')
  if (parts.length > 1) {
    return parts
      .slice(1)
      .join(' ')
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }
  return s
}

const statusColors: Record<string, string> = {
  '1_RASCUNHO': 'hsl(var(--muted-foreground))',
  '2_AGUARDANDO_OPME': 'hsl(45, 93%, 47%)',
  '3_EM_AUDITORIA': 'hsl(24, 95%, 53%)',
  '4_PENDENCIA_TECNICA': 'hsl(0, 84%, 60%)',
  '5_AUTORIZADO': 'hsl(142, 71%, 45%)',
  '6_AGUARDANDO_MAPA': 'hsl(200, 98%, 39%)',
  '7_AGENDADO_CC': 'hsl(217, 91%, 60%)',
  '8_EM_EXECUCAO': 'hsl(262, 83%, 58%)',
  '9_REALIZADO': 'hsl(160, 84%, 39%)',
  '10_CANCELADO': 'hsl(0, 84%, 60%)',
}

export function StatusChart() {
  const { data, loading, error, lastUpdated, refresh } = useReportData<any[]>(
    api.reports.status,
    30000,
  )

  const chartData = useMemo(() => {
    if (!data) return []
    return data.map((d) => ({
      name: cleanStatus(d.status),
      value: Number(d.total),
      fill: statusColors[d.status] || 'hsl(var(--primary))',
    }))
  }, [data])

  const chartConfig = useMemo(() => {
    const config: Record<string, any> = { value: { label: 'Quantidade' } }
    chartData.forEach((d) => {
      config[d.name] = { label: d.name, color: d.fill }
    })
    return config
  }, [chartData])

  return (
    <ReportCard
      title="Distribuição por Status"
      icon={PieChartIcon}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} className="flex-wrap" />
          </PieChart>
        </ChartContainer>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Sem dados disponíveis
        </div>
      )}
    </ReportCard>
  )
}
