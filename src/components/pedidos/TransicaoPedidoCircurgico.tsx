import React, { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowRightCircle } from 'lucide-react'
import { PincasValidationCard } from './PincasValidationCard'
import { RegisterPincaConsumption } from './RegisterPincaConsumption'

const STATUS_LABELS: Record<string, string> = {
  '1_RASCUNHO': 'Rascunho',
  '2_AGUARDANDO_OPME': 'Aguardando OPME',
  '3_EM_AUDITORIA': 'Em Auditoria',
  '4_PENDENCIA_TECNICA': 'Pendência Técnica',
  '5_AUTORIZADO': 'Autorizado',
  '6_AGUARDANDO_ALOCACAO': 'Aguardando Alocação',
  '7_AGENDADO_CC': 'Agendado Centro Cirúrgico',
  '8_EM_EXECUCAO': 'Em Execução',
  '9_REALIZADO': 'Realizado',
  '10_CANCELADO': 'Cancelado',
}

const TRANSICOES_PERMITIDAS: Record<string, string[]> = {
  '1_RASCUNHO': ['2_AGUARDANDO_OPME', '10_CANCELADO'],
  '2_AGUARDANDO_OPME': ['3_EM_AUDITORIA', '1_RASCUNHO', '10_CANCELADO'],
  '3_EM_AUDITORIA': ['4_PENDENCIA_TECNICA', '5_AUTORIZADO', '2_AGUARDANDO_OPME', '10_CANCELADO'],
  '4_PENDENCIA_TECNICA': ['3_EM_AUDITORIA', '5_AUTORIZADO', '10_CANCELADO'],
  '5_AUTORIZADO': ['6_AGUARDANDO_ALOCACAO', '10_CANCELADO'],
  '6_AGUARDANDO_ALOCACAO': ['7_AGENDADO_CC', '10_CANCELADO'],
  '7_AGENDADO_CC': ['8_EM_EXECUCAO', '10_CANCELADO'],
  '8_EM_EXECUCAO': ['9_REALIZADO', '10_CANCELADO'],
  '9_REALIZADO': ['10_CANCELADO'],
  '10_CANCELADO': [],
}

const CAMPOS_POR_ESTADO: Record<string, string[]> = {
  '1_RASCUNHO': [
    'patient_id',
    'surgeon_id',
    'procedure_id',
    'cid10_primary',
    'clinical_indication',
    'pacote_opme_id',
    'alergias_paciente',
    'alergias_descricao',
    'previsao_tempo_minutos',
    'tempo_internacao_dias',
    'reserva_uti',
    'diagnostico_cid10_id',
    'anexo_guia_url',
    'anexo_guia_tipo',
    'proctor_id',
    'proctor_crm',
    'operating_room',
  ],
  '2_AGUARDANDO_OPME': ['pacote_opme_id', 'anexo_guia_url', 'anexo_guia_tipo'],
  '3_EM_AUDITORIA': [],
  '4_PENDENCIA_TECNICA': ['tipo_pendencia', 'descricao_pendencia'],
  '5_AUTORIZADO': ['authorization_number', 'authorization_date'],
  '6_AGUARDANDO_ALOCACAO': [],
  '7_AGENDADO_CC': ['scheduled_date', 'operating_room', 'anesthesiologist_name'],
  '8_EM_EXECUCAO': [],
  '9_REALIZADO': [],
  '10_CANCELADO': ['cancellation_reason'],
}

const FIELD_LABELS: Record<string, string> = {
  patient_id: 'ID do Paciente',
  surgeon_id: 'ID do Cirurgião',
  procedure_id: 'Procedimento',
  cid10_primary: 'CID-10 Principal',
  clinical_indication: 'Indicação Clínica',
  pacote_opme_id: 'Pacote OPME',
  alergias_paciente: 'Paciente possui alergias?',
  alergias_descricao: 'Descrição das Alergias',
  previsao_tempo_minutos: 'Previsão de Tempo (minutos)',
  tempo_internacao_dias: 'Tempo de Internação (dias)',
  reserva_uti: 'Reserva de UTI?',
  diagnostico_cid10_id: 'Diagnóstico CID-10',
  anexo_guia_url: 'URL do Anexo da Guia',
  anexo_guia_tipo: 'Tipo de Anexo',
  proctor_id: 'ID do Proctor',
  proctor_crm: 'CRM do Proctor',
  operating_room: 'Sala Cirúrgica',
  authorization_number: 'Número da Autorização',
  authorization_date: 'Data da Autorização',
  scheduled_date: 'Data Agendada',
  anesthesiologist_name: 'Nome do Anestesista',
  cancellation_reason: 'Motivo do Cancelamento',
  tipo_pendencia: 'Tipo de Pendência',
  descricao_pendencia: 'Descrição da Pendência',
}

export function TransicaoPedidoCircurgico({ pedidoId }: { pedidoId: string }) {
  const { user } = useAuth()

  const [pedido, setPedido] = useState<any>(null)
  const [novoEstado, setNovoEstado] = useState<string>('')
  const [camposDinamicos, setCamposDinamicos] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [erro, setErro] = useState<string | null>(null)

  const [procedures, setProcedures] = useState<any[]>([])
  const [pacotesOpme, setPacotesOpme] = useState<any[]>([])
  const [diagnosticos, setDiagnosticos] = useState<any[]>([])

  const carregarPedido = useCallback(async () => {
    if (!user?.id || !pedidoId) return

    setErro(null)
    setLoading(true)

    try {
      const [procRes, pacotesRes, diagRes, pedRes] = await Promise.all([
        supabase.from('procedures').select('id, name'),
        supabase.from('pacotes_opme').select('id, nome'),
        supabase.from('diagnosticos_cid10').select('id, descricao, codigo_cid10'),
        supabase.from('pedidos_cirurgia').select('*').eq('id', pedidoId).single(),
      ])

      if (procRes.data) setProcedures(procRes.data)
      if (pacotesRes.data) setPacotesOpme(pacotesRes.data)
      if (diagRes.data) setDiagnosticos(diagRes.data)

      if (pedRes.error || !pedRes.data) {
        toast.error('Pedido não encontrado')
        setErro('Pedido não encontrado')
        return
      }

      if (pedRes.data.surgeon_id !== user.id) {
        toast.error('Acesso negado')
        setErro('Você não tem permissão para visualizar as transições deste pedido.')
        return
      }

      setPedido(pedRes.data)
    } catch (e: any) {
      toast.error('Erro ao carregar os dados do pedido')
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }, [pedidoId, user?.id])

  useEffect(() => {
    carregarPedido()
  }, [carregarPedido])

  useEffect(() => {
    if (!pedidoId) return

    const channel = supabase
      .channel(`pedido-${pedidoId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pedidos_cirurgia',
          filter: `id=eq.${pedidoId}`,
        },
        (payload) => {
          if (payload.new) {
            setPedido((prev: any) => ({ ...prev, ...payload.new }))
            toast.info('O pedido foi atualizado por outro usuário')
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pedidoId])

  useEffect(() => {
    if (novoEstado && pedido) {
      const fields = CAMPOS_POR_ESTADO[novoEstado] || []
      const initialValues: any = {}

      fields.forEach((field) => {
        initialValues[field] =
          pedido[field] !== null && pedido[field] !== undefined ? pedido[field] : ''
      })

      setCamposDinamicos(initialValues)
    } else {
      setCamposDinamicos({})
    }
  }, [novoEstado, pedido])

  const handleFieldChange = (field: string, value: any) => {
    setCamposDinamicos((prev: any) => ({ ...prev, [field]: value }))
  }

  const formatDateTimeInput = (dateString: string) => {
    if (!dateString) return ''
    try {
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return ''
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    } catch {
      return ''
    }
  }

  const parseDateTimeInput = (localDateTimeString: string) => {
    if (!localDateTimeString) return ''
    const d = new Date(localDateTimeString)
    if (!isNaN(d.getTime())) {
      return d.toISOString()
    }
    return ''
  }

  const renderField = (field: string) => {
    const value = camposDinamicos[field]
    const label = FIELD_LABELS[field] || field

    switch (field) {
      case 'tipo_pendencia':
        return (
          <div key={field} className="space-y-2">
            <Label>
              {label} <span className="text-red-500">*</span>
            </Label>
            <Select value={value || ''} onValueChange={(v) => handleFieldChange(field, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORCAMENTO_PACIENTE">Orçamento do Paciente</SelectItem>
                <SelectItem value="AUTORIZACAO_CONVENIO">Autorização do Convênio</SelectItem>
                <SelectItem value="INSUMOS_OPME">Insumos/OPME</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case 'clinical_indication':
      case 'cancellation_reason':
      case 'alergias_descricao':
      case 'descricao_pendencia':
        return (
          <div key={field} className="space-y-2">
            <Label>
              {label}{' '}
              {(field === 'cancellation_reason' || field === 'descricao_pendencia') && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Textarea
              value={value || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={`Digite ${label.toLowerCase()}...`}
              rows={field === 'descricao_pendencia' ? 4 : undefined}
            />
          </div>
        )

      case 'authorization_date':
      case 'scheduled_date':
        return (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="datetime-local"
              value={formatDateTimeInput(value)}
              onChange={(e) => handleFieldChange(field, parseDateTimeInput(e.target.value))}
            />
          </div>
        )

      case 'pacote_opme_id':
        return (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Select value={value || ''} onValueChange={(v) => handleFieldChange(field, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pacote..." />
              </SelectTrigger>
              <SelectContent>
                {pacotesOpme.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'procedure_id':
        return (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Select value={value || ''} onValueChange={(v) => handleFieldChange(field, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o procedimento..." />
              </SelectTrigger>
              <SelectContent>
                {procedures.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'diagnostico_cid10_id':
        return (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Select value={value || ''} onValueChange={(v) => handleFieldChange(field, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o diagnóstico..." />
              </SelectTrigger>
              <SelectContent>
                {diagnosticos.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.codigo_cid10} - {d.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'alergias_paciente':
      case 'reserva_uti':
        return (
          <div key={field} className="flex items-center space-x-2 pt-8">
            <Checkbox
              id={field}
              checked={!!value}
              onCheckedChange={(v) => handleFieldChange(field, v)}
            />
            <Label htmlFor={field} className="cursor-pointer">
              {label}
            </Label>
          </div>
        )

      case 'previsao_tempo_minutos':
      case 'tempo_internacao_dias':
        return (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => handleFieldChange(field, parseInt(e.target.value) || 0)}
            />
          </div>
        )

      default:
        return (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
            />
          </div>
        )
    }
  }

  const handleReauthGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.events',
          queryParams: { access_type: 'offline', prompt: 'consent' },
          redirectTo: window.location.href,
        },
      })
      if (error) throw error
    } catch (e: any) {
      toast.error('Erro ao reautenticar Google', { description: e.message })
    }
  }

  const handleSubmit = async () => {
    if (!novoEstado) return

    if (
      novoEstado === '10_CANCELADO' &&
      (!camposDinamicos.cancellation_reason || camposDinamicos.cancellation_reason.trim() === '')
    ) {
      toast.error('O motivo do cancelamento é obrigatório.')
      return
    }

    if (novoEstado === '4_PENDENCIA_TECNICA') {
      if (!camposDinamicos.tipo_pendencia || !camposDinamicos.descricao_pendencia) {
        toast.error('Tipo de Pendência e Descrição são obrigatórios')
        return
      }
    }

    setSubmitting(true)

    if (novoEstado === '7_AGENDADO_CC') {
      try {
        const { data: validacao, error } = await supabase.rpc('validate_pinças_before_scheduling', {
          p_pedido_id: pedidoId,
        })
        if (error) throw error
        if (validacao && validacao.length > 0 && !validacao[0].valid) {
          toast.error(validacao[0].message)
          setSubmitting(false)
          return
        }
      } catch (err: any) {
        toast.error('Erro ao validar pinças: ' + err.message)
        setSubmitting(false)
        return
      }
    }

    const payload = {
      pedido_id: pedidoId,
      new_status: novoEstado,
      notes: null,
      ...camposDinamicos,
    }

    try {
      const { data, error } = await supabase.functions.invoke('update-pedido-cirurgia', {
        body: payload,
      })

      if (error) {
        toast.error(`Erro ao atualizar status: ${error.message}`)
        return
      }

      let parsedData = data
      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data)
        } catch (e) {
          console.error('Erro ao parsear resposta:', e)
        }
      }

      if (!parsedData?.success) {
        const errorMsg = parsedData?.message || 'Erro ao realizar transição'
        console.error('❌ Erro na transição:', errorMsg)
        toast.error(`Erro: ${errorMsg}`)
        return
      }

      if (parsedData?.notificationWarning) {
        toast.warning(`⚠️ Notificação: ${parsedData.notificationWarning}`)
      }

      if (parsedData?.calendarWarning) {
        toast.warning('⚠️ Aviso de Sincronização de Agenda', {
          description: parsedData.calendarWarning,
          action: parsedData.calendarWarning.includes('expirou')
            ? {
                label: 'Reautenticar',
                onClick: handleReauthGoogle,
              }
            : undefined,
        })
      }

      if (novoEstado === '4_PENDENCIA_TECNICA') {
        toast.success(`✅ Pendência registrada: ${camposDinamicos.tipo_pendencia}`)
      } else {
        const groups =
          parsedData?.notifiedGroups?.length > 0
            ? ` Notificações enviadas para: ${parsedData.notifiedGroups.join(', ')}`
            : ''
        toast.success(parsedData?.message || `Transição realizada.${groups}`)
      }

      setNovoEstado('')
      carregarPedido()
    } catch (err: any) {
      toast.error(`Erro inesperado: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="animate-fade-in border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm font-medium">
            Carregando informações do pedido...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (erro) {
    return (
      <Card className="border-red-200 animate-fade-in">
        <CardContent className="p-8 text-center">
          <p className="text-red-600 font-medium mb-2">{erro}</p>
          <Button variant="outline" onClick={carregarPedido}>
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!pedido) return null

  const estadoAtual = pedido.status
  const transicoesPossiveis = TRANSICOES_PERMITIDAS[estadoAtual] || []
  const updatedAt = new Date(pedido.updated_at || pedido.created_at).toLocaleString('pt-BR')

  return (
    <div className="space-y-6">
      <Card className="animate-fade-in shadow-sm border-primary/20">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightCircle className="w-5 h-5 text-primary" />
            Transição de Estado do Pedido
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Estado Atual</p>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-primary" />
                <p className="text-lg font-bold text-foreground">
                  {STATUS_LABELS[estadoAtual] || estadoAtual}
                </p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-sm font-medium text-muted-foreground mb-1">Última Atualização</p>
              <p className="text-sm font-mono text-foreground/80">{updatedAt}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-base font-semibold">Selecione o Próximo Estado</Label>
              <Select
                value={novoEstado}
                onValueChange={setNovoEstado}
                disabled={transicoesPossiveis.length === 0 || submitting}
              >
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue
                    placeholder={
                      transicoesPossiveis.length > 0
                        ? 'Escolha a próxima etapa do processo...'
                        : 'Nenhuma transição permitida neste estágio'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {transicoesPossiveis.map((t) => (
                    <SelectItem key={t} value={t} className="font-medium">
                      {STATUS_LABELS[t] || t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {novoEstado && (
              <div className="space-y-5 animate-in slide-in-from-top-4 duration-300 border rounded-lg p-5 bg-card">
                <div className="border-b pb-3 mb-4">
                  <h3 className="font-semibold text-foreground">
                    Campos Necessários para:{' '}
                    <span className="text-primary">{STATUS_LABELS[novoEstado] || novoEstado}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Preencha as informações exigidas para concluir a transição.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {(CAMPOS_POR_ESTADO[novoEstado] || []).map((field) => renderField(field))}
                </div>

                {(!CAMPOS_POR_ESTADO[novoEstado] || CAMPOS_POR_ESTADO[novoEstado].length === 0) && (
                  <div className="bg-muted/50 p-4 rounded-md border text-center">
                    <p className="text-sm text-muted-foreground italic">
                      Nenhum campo adicional é obrigatório para realizar esta transição.
                    </p>
                  </div>
                )}

                {novoEstado === '7_AGENDADO_CC' && (
                  <div className="mt-4">
                    <PincasValidationCard pedidoId={pedidoId} />
                  </div>
                )}

                <div className="pt-4 mt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando Transição...
                      </>
                    ) : (
                      'Confirmar Transição de Estado'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {estadoAtual === '8_EM_EXECUCAO' && <RegisterPincaConsumption pedidoId={pedidoId} />}
    </div>
  )
}
