import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Clock, ChevronLeft, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { PedidoOpmeSection } from './components/PedidoOpmeSection'
import { DocumentUploadWidget } from '@/components/DocumentUploadWidget'
import { DocumentoLista } from '@/components/DocumentoLista'

export default function PedidoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()

  const [pedido, setPedido] = useState<any>(null)
  const [timeline, setTimeline] = useState<any[]>([])
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshDocs, setRefreshDocs] = useState(0)

  const loadData = async () => {
    if (!id) return
    const [pRes, tRes] = await Promise.all([api.pedidos.get(id), api.pedidos.getTimeline(id)])
    if (pRes.data) setPedido(pRes.data)
    if (tRes.data) setTimeline(tRes.data)
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleActionResponse = (data: any) => {
    if (data?.notificationSent === false) {
      toast.warning(`⚠️ Falha ao notificar grupos. Detalhes: ${data.notificationWarning}`)
    }
    if (data?.calendarWarning) {
      toast.warning(`⚠️ Falha ao sincronizar Google Calendar. Detalhes: ${data.calendarWarning}`)
    }
    if (data?.success && data?.notifiedGroups && data.notifiedGroups.length > 0) {
      toast.success(
        `✅ Transição realizada. Notificações enviadas para: ${data.notifiedGroups.join(', ')}`,
      )
    } else if (data?.success) {
      toast.success(`✅ Transição realizada com sucesso.`)
    }
  }

  const handleStatusChange = async (newStatus: any, actionLabel: string, additionalData?: any) => {
    if (!id || !pedido) return
    const { data, error } = await api.pedidos.updateStatus(
      id,
      pedido.status,
      newStatus,
      actionLabel,
      additionalData,
    )
    if (error) toast.error(error.message || 'Erro ao atualizar status')
    else {
      handleActionResponse(data)
      loadData()
    }
  }

  const handleCancelConfirm = async () => {
    if (!id || !pedido || !cancelReason.trim()) return
    setIsSubmitting(true)
    const { data, error } = await api.pedidos.cancel(id, pedido.status, cancelReason)
    setIsSubmitting(false)
    if (error) toast.error(error.message || 'Erro ao cancelar solicitação')
    else {
      handleActionResponse(data)
      setCancelModalOpen(false)
      setCancelReason('')
      loadData()
    }
  }

  if (!pedido)
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-12 w-[300px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )

  const renderActions = () => {
    const s = pedido.status
    const isMySurgeon = pedido.surgeon_id === user?.id
    const canCancel = hasRole('admin') || hasRole('nursing') || (hasRole('surgeon') && isMySurgeon)

    return (
      <div className="flex flex-wrap gap-2">
        {s === '1_RASCUNHO' && (hasRole('surgeon') || hasRole('secretary')) && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStatusChange('2_AGUARDANDO_OPME', 'Enviar para OPME')}
          >
            Enviar p/ OPME
          </Button>
        )}

        {s === '2_AGUARDANDO_OPME' && hasRole('opme') && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStatusChange('3_EM_AUDITORIA', 'OPME Finalizada')}
          >
            OPME Finalizada
          </Button>
        )}

        {s === '2_AGUARDANDO_OPME' && hasRole('billing') && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStatusChange('3_EM_AUDITORIA', 'Enviar para Auditoria')}
          >
            Enviar p/ Auditoria
          </Button>
        )}

        {s === '3_EM_AUDITORIA' && hasRole('billing') && (
          <Button
            size="sm"
            variant="outline"
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
            onClick={() => handleStatusChange('4_PENDENCIA_TECNICA', 'Pendência Técnica')}
          >
            Pendência Técnica
          </Button>
        )}

        {(s === '3_EM_AUDITORIA' || s === '4_PENDENCIA_TECNICA') && hasRole('billing') && (
          <Button
            size="sm"
            className="bg-lime-600 hover:bg-lime-700 text-white"
            onClick={() => handleStatusChange('5_AUTORIZADO', 'Marcar Autorizado')}
          >
            Marcar Autorizado
          </Button>
        )}

        {s === '5_AUTORIZADO' && hasRole('coordinator') && (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleStatusChange('6_AGUARDANDO_ALOCACAO', 'Aguardando Alocação')}
          >
            Aguardando Alocação
          </Button>
        )}

        {s === '6_AGUARDANDO_ALOCACAO' && hasRole('coordinator') && (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/alocacao-recursos')}
          >
            Alocar Sala/Robô
          </Button>
        )}

        {s === '7_AGENDADO_CC' && hasRole('nursing') && (
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStatusChange('7_AGENDADO_CC', 'Confirmar Agendamento')}
            >
              Confirmar Agendamento
            </Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => handleStatusChange('8_EM_EXECUCAO', 'Iniciar Procedimento')}
            >
              Iniciar Procedimento
            </Button>
          </>
        )}

        {s === '8_EM_EXECUCAO' && hasRole('nursing') && (
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleStatusChange('9_REALIZADO', 'Marcar Realizado')}
          >
            Marcar Realizado
          </Button>
        )}

        {canCancel && s !== '10_CANCELADO' && s !== '9_REALIZADO' && (
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setCancelModalOpen(true)}
          >
            Cancelar
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalhes do Pedido</h1>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                Pedido #{pedido.id.substring(0, 8).toUpperCase()}
                <StatusBadge status={pedido.status} className="text-sm px-3 py-0.5" />
              </CardTitle>
              <CardDescription className="mt-1">
                Criado em {new Date(pedido.created_at).toLocaleString('pt-BR')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Paciente</p>
              <p className="font-semibold mt-1">
                {pedido.patients?.medical_record} — {pedido.patients?.full_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Procedimento</p>
              <p className="font-semibold mt-1">
                {pedido.procedures?.name}{' '}
                <span className="text-muted-foreground font-normal">
                  (TUSS: {pedido.procedures?.tuss_code})
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cirurgião</p>
              <p className="font-semibold mt-1">
                {pedido.profiles?.name}{' '}
                <span className="text-muted-foreground font-normal">
                  — CRM: {pedido.profiles?.crm || 'N/I'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data Agendada</p>
              <p className="font-semibold mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {pedido.scheduled_date
                  ? new Date(pedido.scheduled_date).toLocaleDateString('pt-BR')
                  : 'Não definida'}
              </p>
            </div>
          </div>

          {(pedido.clinical_indication || pedido.clinical_summary) && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Observações / Indicação Clínica
              </p>
              <p className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                {pedido.clinical_summary || pedido.clinical_indication}
              </p>
            </div>
          )}

          {pedido.status === '10_CANCELADO' && pedido.cancellation_reason && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-red-600 mb-2">Motivo do Cancelamento</p>
              <p className="bg-red-50 p-4 rounded-lg text-sm text-red-900 border border-red-100 whitespace-pre-wrap">
                {pedido.cancellation_reason}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <span className="text-sm font-medium text-muted-foreground mr-auto">
            Ações disponíveis:
          </span>
          {renderActions()}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> Histórico de Alterações
        </h2>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {timeline.map((log: any, i) => (
            <div
              key={log.id}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10',
                  i === timeline.length - 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                <Clock className="w-4 h-4" />
              </div>
              <div
                className={cn(
                  'w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-lg border shadow-sm',
                  i === timeline.length - 1 && 'border-primary/50 shadow-md',
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn(
                      'font-medium text-foreground',
                      i === timeline.length - 1 && 'font-bold',
                    )}
                  >
                    {log.action}
                  </span>
                  <time className="text-xs text-muted-foreground font-mono">
                    {new Date(log.changed_at).toLocaleString('pt-BR')}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  por {log.profiles?.name || 'Sistema'}
                </p>
                {log.notes && (
                  <div className="mt-2 text-sm bg-muted/50 p-2 rounded text-muted-foreground border">
                    <span className="font-semibold">Motivo:</span> {log.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
          {timeline.length === 0 && (
            <p className="text-sm text-muted-foreground text-center pt-4 relative z-10 bg-background inline-block mx-auto px-4">
              Nenhum evento registrado.
            </p>
          )}
        </div>
      </div>

      {id && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Documentos do Pedido</h2>
          <DocumentUploadWidget
            pedidoId={id}
            onUploadSuccess={() => setRefreshDocs((prev) => prev + 1)}
          />
          <DocumentoLista
            pedidoId={id}
            refreshTrigger={refreshDocs}
            onDeleted={() => setRefreshDocs((prev) => prev + 1)}
          />
        </div>
      )}

      {id && <PedidoOpmeSection pedidoId={id} />}

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Solicitação Cirúrgica</DialogTitle>
            <DialogDescription>
              Você está prestes a cancelar esta solicitação. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason" className="text-red-600 font-medium">
                Motivo do Cancelamento (Obrigatório)
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Descreva o motivo pelo qual esta cirurgia está sendo cancelada..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelModalOpen(false)}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || isSubmitting}
            >
              {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
