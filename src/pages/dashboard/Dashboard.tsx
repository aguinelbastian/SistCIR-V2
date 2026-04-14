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
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Eye, Plus, Activity, Clock, ShieldAlert, Percent } from 'lucide-react'
import { PedidoCirurgia, SurgeryStatus } from '@/types/sistcir'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import { useReportData } from '@/hooks/use-report-data'

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Partial<PedidoCirurgia>[]>([])
  const [loading, setLoading] = useState(true)
  const { user, roles, hasRole, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [pedidoToCancel, setPedidoToCancel] = useState<string | null>(null)
  const [pedidoToCancelStatus, setPedidoToCancelStatus] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: conversao } = useReportData(() => api.reports.conversao(), 60000)

  const loadData = async () => {
    setLoading(true)
    const viewAll = ['admin', 'secretary', 'opme', 'billing', 'nursing', 'coordinator'].some((r) =>
      roles.includes(r),
    )
    const filters = viewAll ? undefined : { surgeonId: user?.id }

    const { data, error } = await api.pedidos.listDashboard(filters)
    if (data) setPedidos(data as any)
    if (error) toast.error('Erro ao carregar solicitações')
    setLoading(false)
  }

  useEffect(() => {
    if (user && !authLoading) {
      loadData()
    }
  }, [user, authLoading, roles])

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

  const handleUpdateStatus = async (
    e: React.MouseEvent,
    id: string,
    statusFrom: string,
    newStatus: SurgeryStatus,
    actionLabel: string,
    additionalData?: any,
  ) => {
    e?.stopPropagation()
    const { data, error } = await api.pedidos.updateStatus(
      id,
      statusFrom,
      newStatus,
      actionLabel,
      additionalData,
    )
    if (error) {
      toast.error(error.message || 'Erro ao atualizar status')
    } else {
      handleActionResponse(data)
      loadData()
    }
  }

  const handleCancelConfirm = async () => {
    if (!pedidoToCancel || !pedidoToCancelStatus || !cancelReason.trim()) return
    setIsSubmitting(true)
    const { data, error } = await api.pedidos.cancel(
      pedidoToCancel,
      pedidoToCancelStatus,
      cancelReason,
    )
    setIsSubmitting(false)
    if (error) {
      toast.error(error.message || 'Erro ao cancelar solicitação')
    } else {
      handleActionResponse(data)
      setCancelModalOpen(false)
      setPedidoToCancel(null)
      setPedidoToCancelStatus(null)
      setCancelReason('')
      loadData()
    }
  }

  const [agendarModalOpen, setAgendarModalOpen] = useState(false)
  const [pedidoToSchedule, setPedidoToSchedule] = useState<{
    id: string
    statusFrom: string
  } | null>(null)
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    room: '',
    anesthesiologist: '',
  })

  const handleAgendarConfirm = async () => {
    if (
      !pedidoToSchedule ||
      !scheduleData.date ||
      !scheduleData.time ||
      !scheduleData.room ||
      !scheduleData.anesthesiologist
    ) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    setIsSubmitting(true)

    const scheduledDate = new Date(`${scheduleData.date}T${scheduleData.time}`).toISOString()

    await handleUpdateStatus(
      null as any,
      pedidoToSchedule.id,
      pedidoToSchedule.statusFrom,
      '7_AGENDADO_CC',
      'Alocar Sala/Robô',
      {
        scheduled_date: scheduledDate,
        operating_room: scheduleData.room,
        anesthesiologist_name: scheduleData.anesthesiologist,
      },
    )

    setIsSubmitting(false)
    setAgendarModalOpen(false)
    setPedidoToSchedule(null)
    setScheduleData({ date: '', time: '', room: '', anesthesiologist: '' })
  }

  const stats = {
    total: pedidos.length,
    emProgresso: pedidos.filter(
      (p) => p.status && !['1_RASCUNHO', '9_REALIZADO', '10_CANCELADO'].includes(p.status),
    ).length,
    atencao: pedidos.filter((p) => p.status === '4_PENDENCIA_TECNICA').length,
  }

  const renderActions = (pedido: Partial<PedidoCirurgia>) => {
    const s = pedido.status!
    const isMySurgeon = pedido.surgeon_id === user?.id
    const canCancel = hasRole('admin') || hasRole('nursing') || (hasRole('surgeon') && isMySurgeon)

    return (
      <div className="flex flex-wrap gap-2 justify-end items-center">
        {s === '1_RASCUNHO' && (hasRole('surgeon') || hasRole('secretary')) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) =>
              handleUpdateStatus(e, pedido.id!, s, '2_AGUARDANDO_OPME', 'Enviar para OPME')
            }
          >
            Enviar p/ OPME
          </Button>
        )}

        {s === '2_AGUARDANDO_OPME' && hasRole('opme') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) =>
              handleUpdateStatus(e, pedido.id!, s, '6_AGUARDANDO_ALOCACAO', 'OPME Finalizada')
            }
          >
            OPME Finalizada
          </Button>
        )}

        {s === '2_AGUARDANDO_OPME' && hasRole('billing') && (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) =>
              handleUpdateStatus(e, pedido.id!, s, '3_EM_AUDITORIA', 'Enviar para Auditoria')
            }
          >
            Enviar p/ Auditoria
          </Button>
        )}

        {s === '3_EM_AUDITORIA' && hasRole('billing') && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) =>
              handleUpdateStatus(e, pedido.id!, s, '4_PENDENCIA_TECNICA', 'Pendência Técnica')
            }
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            Pendência Técnica
          </Button>
        )}

        {(s === '3_EM_AUDITORIA' || s === '4_PENDENCIA_TECNICA') && hasRole('billing') && (
          <Button
            variant="default"
            size="sm"
            onClick={(e) =>
              handleUpdateStatus(e, pedido.id!, s, '5_AUTORIZADO', 'Marcar Autorizado')
            }
            className="bg-lime-600 hover:bg-lime-700"
          >
            Marcar Autorizado
          </Button>
        )}

        {s === '5_AUTORIZADO' && hasRole('coordinator') && (
          <Button
            variant="default"
            size="sm"
            onClick={(e) =>
              handleUpdateStatus(e, pedido.id!, s, '6_AGUARDANDO_ALOCACAO', 'Aguardando Alocação')
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Aguardando Alocação
          </Button>
        )}

        {s === '6_AGUARDANDO_ALOCACAO' && hasRole('coordinator') && (
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setPedidoToSchedule({ id: pedido.id!, statusFrom: s })
              setAgendarModalOpen(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Alocar Sala/Robô
          </Button>
        )}

        {s === '7_AGENDADO_CC' && hasRole('nursing') && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) =>
                handleUpdateStatus(e, pedido.id!, s, '7_AGENDADO_CC', 'Confirmar Agendamento')
              }
            >
              Confirmar Agendamento
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={(e) =>
                handleUpdateStatus(e, pedido.id!, s, '8_EM_EXECUCAO', 'Iniciar Procedimento')
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              Iniciar Procedimento
            </Button>
          </>
        )}

        {s === '8_EM_EXECUCAO' && hasRole('nursing') && (
          <Button
            variant="default"
            size="sm"
            onClick={(e) => handleUpdateStatus(e, pedido.id!, s, '9_REALIZADO', 'Marcar Realizado')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Marcar Realizado
          </Button>
        )}

        {canCancel && s !== '10_CANCELADO' && s !== '9_REALIZADO' && (
          <Button
            variant="ghost"
            size="sm"
            title="Cancelar Solicitação"
            onClick={(e) => {
              e.stopPropagation()
              setPedidoToCancel(pedido.id!)
              setPedidoToCancelStatus(s)
              setCancelModalOpen(true)
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Cancelar
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          title="Ver Detalhes"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/pedidos/${pedido.id}`)
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Painel de Cirurgias</h1>
        {(hasRole('surgeon') || hasRole('secretary')) && (
          <Button asChild>
            <Link to="/pedidos/novo">
              <Plus className="w-4 h-4 mr-2" /> Novo Pedido
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Percent className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversao?.taxa_realizacao_geral_pct != null
                ? `${Number(conversao.taxa_realizacao_geral_pct).toFixed(1)}%`
                : '-'}
            </div>
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
                <TableRow
                  key={pedido.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => navigate(`/pedidos/${pedido.id}`)}
                >
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {pedido.id?.substring(0, 6).toUpperCase()}
                  </TableCell>
                  <TableCell
                    className="font-medium max-w-[250px] truncate"
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
                  <TableCell className="text-right">{renderActions(pedido)}</TableCell>
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

      <Dialog open={agendarModalOpen} onOpenChange={setAgendarModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Cirurgia no CC</DialogTitle>
            <DialogDescription>
              Informe a data, horário, sala e anestesista para confirmar o agendamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-date">Data (Obrigatório)</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule-time">Horário (Obrigatório)</Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-room">Sala Cirúrgica (Obrigatório)</Label>
              <Input
                id="schedule-room"
                placeholder="Ex: Sala 01"
                value={scheduleData.room}
                onChange={(e) => setScheduleData((prev) => ({ ...prev, room: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-anesthesiologist">Anestesista (Obrigatório)</Label>
              <Input
                id="schedule-anesthesiologist"
                placeholder="Nome do Anestesista"
                value={scheduleData.anesthesiologist}
                onChange={(e) =>
                  setScheduleData((prev) => ({ ...prev, anesthesiologist: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAgendarModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAgendarConfirm}
              disabled={
                !scheduleData.date ||
                !scheduleData.time ||
                !scheduleData.room ||
                !scheduleData.anesthesiologist ||
                isSubmitting
              }
            >
              {isSubmitting ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      </D