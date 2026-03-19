import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api } from '@/services/api'
import { StatusBadge } from '@/components/StatusBadge'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Eye, Plus, Activity, Clock, ShieldAlert } from 'lucide-react'
import { PedidoCirurgia } from '@/types/sistcir'

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Partial<PedidoCirurgia>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.pedidos.listDashboard()
      if (data) setPedidos(data as any)
      setLoading(false)
    }
    fetchData()
  }, [])

  const stats = {
    total: pedidos.length,
    emProgresso: pedidos.filter(
      (p) => p.status && !['1_RASCUNHO', '9_REALIZADO', '10_CANCELADO'].includes(p.status),
    ).length,
    atencao: pedidos.filter((p) => p.status === '4_PENDENCIA_TECNICA').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Cirurgias</h1>
        <Button asChild>
          <Link to="/pedidos/novo">
            <Plus className="w-4 h-4 mr-2" /> Novo Pedido
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Solicitações
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Em Progresso (Esteira)
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emProgresso}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Requerem Atenção
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.atencao}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Recentes</CardTitle>
          <CardDescription>Acompanhamento de ponta a ponta da esteira cirúrgica.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Procedimento</TableHead>
                <TableHead>Prontuário</TableHead>
                <TableHead>Cirurgião</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Agendada</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {pedido.id?.substring(0, 6).toUpperCase()}
                  </TableCell>
                  <TableCell
                    className="font-medium max-w-[300px] truncate"
                    title={pedido.procedures?.name}
                  >
                    {pedido.procedures?.name || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <span className="bg-muted px-2 py-1 rounded text-xs font-mono text-muted-foreground border">
                      {pedido.patients?.medical_record || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="truncate max-w-[150px]" title={pedido.profiles?.name || ''}>
                    {pedido.profiles?.name || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={pedido.status || null} />
                  </TableCell>
                  <TableCell>
                    {pedido.scheduled_date ? (
                      new Date(pedido.scheduled_date).toLocaleDateString('pt-BR')
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/pedidos/${pedido.id}`}>
                        <Eye className="w-4 h-4 mr-2" /> Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pedidos.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="w-8 h-8 text-muted mb-2" />
                      <p>Nenhuma solicitação encontrada no momento.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
