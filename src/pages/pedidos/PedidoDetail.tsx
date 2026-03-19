import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Clock, Send, CheckCircle, FileText } from 'lucide-react'

export default function PedidoDetail() {
  const { id } = useParams()
  const [pedido, setPedido] = useState<any>(null)
  const [timeline, setTimeline] = useState<any[]>([])
  const { hasRole } = useAuth()

  const loadData = async () => {
    if (!id) return
    const [pRes, tRes] = await Promise.all([api.pedidos.get(id), api.pedidos.getTimeline(id)])
    if (pRes.data) setPedido(pRes.data)
    if (tRes.data) setTimeline(tRes.data)
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleStatusChange = async (newStatus: any) => {
    if (!id) return
    const { error } = await api.pedidos.updateStatus(id, newStatus)
    if (error) toast.error('Erro ao atualizar status')
    else {
      toast.success('Status atualizado com sucesso!')
      loadData()
    }
  }

  if (!pedido)
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedido #{pedido.id.split('-')[0]}</h1>
          <p className="text-muted-foreground mt-1">
            Criado em {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <StatusBadge status={pedido.status} className="text-base px-4 py-1" />
      </div>

      {/* Action Bar based on Role and Status */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 flex gap-3 items-center">
          <span className="text-sm font-medium text-muted-foreground mr-auto">
            Ações disponíveis:
          </span>
          {pedido.status === '1_RASCUNHO' && hasRole('surgeon') && (
            <Button onClick={() => handleStatusChange('2_AGUARDANDO_OPME')}>
              <Send className="w-4 h-4 mr-2" /> Enviar para OPME
            </Button>
          )}
          {pedido.status === '2_AGUARDANDO_OPME' && hasRole('opme') && (
            <Button
              onClick={() => handleStatusChange('3_EM_AUDITORIA')}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Aprovar OPME
            </Button>
          )}
          {pedido.status === '3_EM_AUDITORIA' && hasRole('billing') && (
            <Button
              onClick={() => handleStatusChange('5_AUTORIZADO')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Autorizar Convênio
            </Button>
          )}
          {pedido.status === '5_AUTORIZADO' && hasRole('coordinator') && (
            <Button onClick={() => handleStatusChange('7_AGENDADO_CC')}>
              <FileText className="w-4 h-4 mr-2" /> Agendar no CC
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes Clínicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground block">Paciente</span>
                  <span className="font-medium">{pedido.patients?.full_name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Procedimento</span>
                  <span className="font-medium">{pedido.procedures?.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">CID-10</span>
                  <span>{pedido.cid10_primary}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">ASA</span>
                  <span>{pedido.asa_classification}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <span className="text-muted-foreground block mb-1">Indicação Clínica</span>
                <p className="bg-muted p-3 rounded-md">{pedido.clinical_indication}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {timeline.map((log: any, i) => (
                  <div
                    key={log.id}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-background bg-muted-foreground text-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-card p-3 rounded-lg border shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm text-foreground">
                          {log.event_type}
                        </span>
                      </div>
                      <time className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </time>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && (
                  <p className="text-sm text-muted-foreground pl-8">Nenhum evento registrado.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
