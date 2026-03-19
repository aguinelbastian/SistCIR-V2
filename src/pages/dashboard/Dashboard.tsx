import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { api } from '@/services/api'
import { StatusBadge } from '@/components/StatusBadge'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [stats, setStats] = useState({ rascunho: 0, aguardando: 0, autorizado: 0, total: 0 })
  const [recent, setRecent] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.pedidos.list()
      if (data) {
        setRecent(data.slice(0, 5))
        setStats({
          rascunho: data.filter((d) => d.status === '1_RASCUNHO').length,
          aguardando: data.filter((d) => d.status?.includes('AGUARDANDO')).length,
          autorizado: data.filter((d) => d.status === '5_AUTORIZADO').length,
          total: data.length,
        })
      }
    }
    fetchData()
  }, [])

  const kpis = [
    { title: 'Total de Pedidos', value: stats.total, icon: Activity, color: 'text-blue-500' },
    { title: 'Em Rascunho', value: stats.rascunho, icon: Clock, color: 'text-gray-500' },
    {
      title: 'Aguardando Ação',
      value: stats.aguardando,
      icon: AlertCircle,
      color: 'text-amber-500',
    },
    {
      title: 'Autorizados',
      value: stats.autorizado,
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pedidos Recentes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Últimas cirurgias cadastradas no sistema.
            </p>
          </div>
          <Button variant="outline" asChild size="sm">
            <Link to="/pedidos">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recent.map((pedido) => (
              <div
                key={pedido.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <Link to={`/pedidos/${pedido.id}`} className="font-medium hover:underline">
                    {pedido.patients?.full_name}
                  </Link>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{pedido.procedures?.name}</span>
                    <span>•</span>
                    <span>{new Date(pedido.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <StatusBadge status={pedido.status} />
              </div>
            ))}
            {recent.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">Nenhum pedido encontrado.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
