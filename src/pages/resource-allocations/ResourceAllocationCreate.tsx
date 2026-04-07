import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ResourceAllocationCreate() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pedidos, setPedidos] = useState<any[]>([])
  const [blocks, setBlocks] = useState<any[]>([])
  const [roboticSystems, setRoboticSystems] = useState<any[]>([])
  const [preferences, setPreferences] = useState<any[]>([])

  const [formData, setFormData] = useState({
    pedido_id: '',
    robotic_system_id: '',
    estimated_duration_minutes: 60,
    allocation_mode: 'preference' as 'preference' | 'fallback',
    preference_id: '',
    fallback_block_id: '',
    fallback_reason: '',
  })

  useEffect(() => {
    async function loadData() {
      const [pRes, bRes, rRes] = await Promise.all([
        supabase
          .from('pedidos_cirurgia')
          .select(
            'id, surgeon_id, profiles!pedidos_cirurgia_surgeon_id_fkey(name), patients(full_name, medical_record), procedures(name)',
          )
          .eq('status', '6_AGUARDANDO_MAPA'),  // ✅ CORRIGIDO: Apenas status 4
        supabase
          .from('v_blocos_disponiveis')
          .select(
            'bloco_id, block_date, block_start_time, block_end_time, surgical_room_id, status_bloco, num_cirurgioes_interessados, surgical_rooms(room_name)',
          )
          .gte('block_date', new Date().toISOString().split('T')[0])
          .order('block_date')
          .order('block_start_time'),
        supabase.from('robotic_systems').select('id, system_name').eq('is_operational', true),
      ])

      if (pRes.data) setPedidos(pRes.data)
      if (bRes.data) setBlocks(bRes.data)
      if (rRes.data) setRoboticSystems(rRes.data)
    }
    loadData()
  }, [])

  const handlePedidoChange = async (val: string) => {
    setFormData((prev) => ({
      ...prev,
      pedido_id: val,
      allocation_mode: 'preference',
      preference_id: '',
      fallback_block_id: '',
      fallback_reason: '',
    }))

    if (!val) {
      setPreferences([])
      return
    }

    const { data } = await supabase
      .from('surgical_request_block_preferences')
      .select(
        'id, preference_order, surgical_block_id, surgical_blocks(block_date, block_start_time, block_end_time, surgical_rooms(room_name))',
      )
      .eq('pedido_cirurgia_id', val)
      .order('preference_order')

    setPreferences(data || [])
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.pedido_id) return toast.error('Selecione o pedido cirúrgico')
    if (!formData.robotic_system_id) return toast.error('Selecione o sistema robótico')

    const selectedPedido = pedidos.find((p) => p.id === formData.pedido_id)
    if (!selectedPedido?.surgeon_id) {
      return toast.error('O pedido selecionado não possui um cirurgião vinculado.')
    }

    let finalBlockId = ''
    let isFallback = false
    let prefOrder = null
    let origPrefId = null

    if (formData.allocation_mode === 'preference') {
      if (!formData.preference_id) {
        return toast.error('Selecione uma das opções de preferência ou escolha o Fallback.')
      }
      const pref = preferences.find((p) => p.id === formData.preference_id)
      if (!pref) return toast.error('Preferência inválida')
      finalBlockId = pref.surgical_block_id
      prefOrder = pref.preference_order
      origPrefId = pref.id
    } else {
      if (!formData.fallback_block_id) return toast.error('Selecione um bloco alternativo')
      if (!formData.fallback_reason.trim()) return toast.error('Informe o motivo do fallback')
      finalBlockId = formData.fallback_block_id
      isFallback = true
    }

    const blockDetails = blocks.find((b) => b.bloco_id === finalBlockId)
    if (!blockDetails) return toast.error('Bloco selecionado não encontrado ou indisponível.')

    if (blockDetails.status_bloco === 'ALOCADO') {
      return toast.error('Este bloco já está alocado. Selecione outro.')
    }

    setIsSubmitting(true)
    try {
      const payload = {
        pedido_id: formData.pedido_id,
        surgical_block_id: finalBlockId,
        surgical_room_id: blockDetails.surgical_room_id,
        robotic_system_id: formData.robotic_system_id,
        allocated_surgeon_id: selectedPedido.surgeon_id,
        estimated_duration_minutes: formData.estimated_duration_minutes,
        allocated_by: user?.id,
        allocation_status: 'ALOCADO' as const,
        is_fallback_allocation: isFallback,
        fallback_reason: isFallback ? formData.fallback_reason : null,
        selected_preference_order: prefOrder,
        original_preference_id: origPrefId,
      }

      const { error } = await supabase.from('resource_allocation').insert([payload])

      if (error) throw error
      toast.success('Alocação criada com sucesso!')
      navigate('/alocacao-recursos')
    } catch (err: any) {
      toast.error('Erro ao alocar: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPedido = pedidos.find((p) => p.id === formData.pedido_id)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Nova Alocação de Recurso</CardTitle>
          <CardDescription>
            Aloque cirurgias para as salas e robôs com base nas preferências do cirurgião.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Pedido Cirúrgico (Autorizado / Aguardando Mapa)</Label>
              <Select value={formData.pedido_id} onValueChange={handlePedidoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cirurgia..." />
                </SelectTrigger>
                <SelectContent>
                  {pedidos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.patients?.full_name} ({p.patients?.medical_record}) - {p.procedures?.name}
                    </SelectItem>
                  ))}
                  {pedidos.length === 0 && (
                    <SelectItem value="none" disabled>
                      Nenhum pedido disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedPedido && (
              <div className="bg-muted p-4 rounded-md space-y-1">
                <p className="text-sm font-medium">Cirurgião Responsável</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPedido.profiles?.name || 'Não informado'}
                </p>
                <p className="text-xs text-muted-foreground italic mt-2">
                  (Identificado automaticamente a partir do pedido cirúrgico selecionado)
                </p>
              </div>
            )}

            {selectedPedido && (
              <div className="space-y-4 border p-4 rounded-md">
                <Label className="text-base font-semibold">Horário da Cirurgia</Label>

                <RadioGroup
                  value={
                    formData.allocation_mode === 'preference' ? formData.preference_id : 'fallback'
                  }
                  onValueChange={(val) => {
                    if (val === 'fallback') {
                      setFormData({ ...formData, allocation_mode: 'fallback', preference_id: '' })
                    } else {
                      setFormData({
                        ...formData,
                        allocation_mode: 'preference',
                        preference_id: val,
                      })
                    }
                  }}
                  className="space-y-4"
                >
                  {preferences.length === 0 ? (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                      Nenhuma preferência registrada para este pedido. Selecione a opção de Fallback
                      abaixo.
                    </div>
                  ) : (
                    preferences.map((pref) => {
                      const b = blocks.find((x) => x.bloco_id === pref.surgical_block_id)
                      const isAlocado = b?.status_bloco === 'ALOCADO'
                      const isReservado = b?.status_bloco === 'RESERVADO_PREFERENCIA'

                      return (
                        <div key={pref.id} className="flex items-start space-x-3">
                          <RadioGroupItem
                            value={pref.id}
                            id={pref.id}
                            disabled={isAlocado}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={pref.id}
                            className={cn(
                              'font-normal cursor-pointer flex flex-col',
                              isAlocado && 'opacity-50',
                            )}
                          >
                            <span className="font-medium">
                              Preferência {pref.preference_order}:{' '}
                              {pref.surgical_blocks?.block_date
                                ? format(parseISO(pref.surgical_blocks.block_date), 'dd/MM/yyyy')
                                : ''}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {pref.surgical_blocks?.block_start_time?.substring(0, 5)} às{' '}
                              {pref.surgical_blocks?.block_end_time?.substring(0, 5)} |{' '}
                              {pref.surgical_blocks?.surgical_rooms?.room_name}
                            </span>
                            <div className="mt-1 flex items-center gap-2 text-xs font-medium">
                              <div
                                className={cn(
                                  'w-2 h-2 rounded-full',
                                  !b
                                    ? 'bg-gray-400'
                                    : isAlocado
                                      ? 'bg-red-500'
                                      : isReservado
                                        ? 'bg-amber-500'
                                        : 'bg-green-500',
                                )}
                              />
                              <span
                                className={cn(
                                  !b
                                    ? 'text-gray-500'
                                    : isAlocado
                                      ? 'text-red-600'
                                      : isReservado
                                        ? 'text-amber-600'
                                        : 'text-green-600',
                                )}
                              >
                                {!b
                                  ? 'Data no passado ou indisponível'
                                  : isAlocado
                                    ? 'Já alocado'
                                    : isReservado
                                      ? `Reservado (${b.num_cirurgioes_interessados} interessados)`
                                      : 'Livre para alocação'}
                              </span>
                            </div>
                          </Label>
                        </div>
                      )
                    })
                  )}

                  <div className="flex items-start space-x-3 pt-4 border-t">
                    <RadioGroupItem value="fallback" id="fallback" className="mt-1" />
                    <Label htmlFor="fallback" className="font-normal cursor-pointer">
                      <span className="font-medium text-blue-600">
                        Alocar em outro horário (Fallback)
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Escolher manualmente um bloco diferente das preferências.
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {formData.allocation_mode === 'fallback' && (
              <div className="space-y-4 p-4 border border-blue-100 rounded-md bg-blue-50/50 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label>Bloco Cirúrgico Alternativo</Label>
                  <Select
                    value={formData.fallback_block_id}
                    onValueChange={(v) => {
                      const b = blocks.find((x) => x.bloco_id === v)
                      if (b?.status_bloco === 'ALOCADO') {
                        toast.error('Este bloco já está alocado. Selecione outro.')
                        return
                      }
                      if (b?.status_bloco === 'RESERVADO_PREFERENCIA') {
                        toast.warning(
                          `${b.num_cirurgioes_interessados} cirurgiões interessados neste bloco.`,
                        )
                      }
                      setFormData({ ...formData, fallback_block_id: v })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um bloco..." />
                    </SelectTrigger>
                    <SelectContent>
                      {blocks.map((b) => {
                        const isAlocado = b.status_bloco === 'ALOCADO'
                        const isReservado = b.status_bloco === 'RESERVADO_PREFERENCIA'
                        return (
                          <SelectItem
                            key={b.bloco_id}
                            value={b.bloco_id}
                            disabled={isAlocado}
                            className={isAlocado ? 'opacity-50 grayscale' : ''}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'w-3 h-3 rounded-full flex-shrink-0',
                                  isAlocado
                                    ? 'bg-red-500'
                                    : isReservado
                                      ? 'bg-amber-500'
                                      : 'bg-green-500',
                                )}
                              />
                              <span>
                                {format(parseISO(b.block_date), 'dd/MM/yyyy')} |{' '}
                                {b.block_start_time?.substring(0, 5)} às{' '}
                                {b.block_end_time?.substring(0, 5)} | {b.surgical_rooms?.room_name}
                              </span>
                              {isReservado && (
                                <span className="text-xs text-amber-600 font-medium ml-2">
                                  ({b.num_cirurgioes_interessados} interessados)
                                </span>
                              )}
                              {isAlocado && (
                                <span className="text-xs text-red-500 font-medium ml-2">
                                  Já alocado
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        )
                      })}
                      {blocks.length === 0 && (
                        <SelectItem value="none" disabled>
                          Nenhum bloco encontrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Motivo do Fallback</Label>
                  <Textarea
                    placeholder="Ex: Preferências indisponíveis, pedido urgente do cirurgião, etc."
                    value={formData.fallback_reason}
                    onChange={(e) => setFormData({ ...formData, fallback_reason: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Sistema Robótico</Label>
                <Select
                  value={formData.robotic_system_id}
                  onValueChange={(v) => setFormData({ ...formData, robotic_system_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roboticSystems.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.system_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duração Estimada (min)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.estimated_duration_minutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimated_duration_minutes: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Alocando...' : 'Salvar Alocação'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
