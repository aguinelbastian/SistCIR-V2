import { useMemo, useState } from 'react'
import { useReportData } from '@/hooks/use-report-data'
import { api } from '@/services/api'
import { ReportCard } from './ReportCard'
import { AlertOctagon, Search } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const getInitials = (name: string) => {
  if (!name) return 'N/I'
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0].toUpperCase() + '.')
    .join('')
}

const getBadgeVariant = (status: string) => {
  if (status === 'OK')
    return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
  if (status === 'ATENÇÃO') return 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200'
  if (status === 'CRÍTICO')
    return 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20'
  return 'bg-muted text-muted-foreground'
}

export function SlaTable() {
  // Poll every 10 seconds per requirements
  const { data, loading, error, lastUpdated, refresh } = useReportData<any[]>(
    api.reports.sla,
    10000,
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage] = useState(0)
  const ITEMS_PER_PAGE = 10

  const filteredData = useMemo(() => {
    if (!data) return []
    let result = [...data]

    if (statusFilter !== 'ALL') {
      result = result.filter((d) => d.status_sla === statusFilter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          (d.cirurgiao && d.cirurgiao.toLowerCase().includes(q)) ||
          (d.paciente && getInitials(d.paciente).toLowerCase().includes(q)) ||
          (d.procedimento && d.procedimento.toLowerCase().includes(q)),
      )
    }

    // Sort by horas_pendente DESC
    result.sort((a, b) => Number(b.horas_pendente) - Number(a.horas_pendente))

    return result
  }, [data, search, statusFilter])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <ReportCard
      title="SLA: Pedidos Pendentes de Aprovação"
      icon={AlertOctagon}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      className="md:col-span-2 lg:col-span-3"
      contentClassName="flex flex-col"
    >
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cirurgião, paciente ou procedimento..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(0)
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setPage(0)
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Status</SelectItem>
            <SelectItem value="OK">OK</SelectItem>
            <SelectItem value="ATENÇÃO">Atenção</SelectItem>
            <SelectItem value="CRÍTICO">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border flex-1">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Cirurgião</TableHead>
              <TableHead>Paciente</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead>Agendamento</TableHead>
              <TableHead className="text-right">Horas Pendentes</TableHead>
              <TableHead className="text-center">SLA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium truncate max-w-[150px]" title={row.cirurgiao}>
                  {row.cirurgiao || 'N/I'}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {getInitials(row.paciente)}
                </TableCell>
                <TableCell className="truncate max-w-[200px]" title={row.procedimento}>
                  {row.procedimento || 'N/I'}
                </TableCell>
                <TableCell>
                  {row.scheduled_date
                    ? new Date(row.scheduled_date).toLocaleDateString('pt-BR')
                    : '-'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {Number(row.horas_pendente).toFixed(0)}h
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={getBadgeVariant(row.status_sla)}>
                    {row.status_sla || 'N/I'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum pedido pendente encontrado para os filtros atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {page * ITEMS_PER_PAGE + 1} a{' '}
            {Math.min((page + 1) * ITEMS_PER_PAGE, filteredData.length)} de {filteredData.length}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </ReportCard>
  )
}
