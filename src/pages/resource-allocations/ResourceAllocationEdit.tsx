import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Info, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { resourceAllocationSchema, type ResourceAllocationFormValues } from './schema'

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export default function ResourceAllocationEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [data, setData] = useState<{
    pedidos: any[]
    rooms: any[]
    robots: any[]
    blocks: any[]
    profiles: any[]
  }>({
    pedidos: [],
    rooms: [],
    robots: [],
    blocks: [],
    profiles: [],
  })

  const [preferences, setPreferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const form = useForm<ResourceAllocationFormValues>({
    resolver: zodResolver(resourceAllocationSchema),
    defaultValues: {
      estimated_duration_minutes: 60,
      allocation_status: 'ALOCADO',
      allocated_proctor_id: 'none',
      is_fallback_allocation: false,
    },
  })

  useEffect(() => {
    if (!id) return

    Promise.all([
      supabase.from('pedidos_cirurgia').select('id, patients(full_name), status').limit(100),
      supabase.from('surgical_rooms').select('id, room_name'),
      supabase.from('robotic_systems').select('id, system_name'),
      supabase
        .from('surgical_blocks')
        .select('id, block_date, block_start_time, block_end_time, surgical_room_id'),
      supabase.from('profiles').select('id, name'),
      supabase.from('resource_allocation').select('*').eq('id', id).single(),
    ]).then(([resPedidos, resRooms, resRobots, resBlocks, resProfiles, resAlloc]) => {
      setData({
        pedidos: resPedidos.data || [],
        rooms: resRooms.data || [],
        robots: resRobots.data || [],
        blocks: resBlocks.data || [],
        profiles: resProfiles.data || [],
      })

      if (resAlloc.data) {
        const isFallback = resAlloc.data.is_fallback_allocation
        form.reset({
          pedido_id: resAlloc.data.pedido_id,
          surgical_room_id: resAlloc.data.surgical_room_id,
          robotic_system_id: resAlloc.data.robotic_system_id,
          surgical_block_id: resAlloc.data.surgical_block_id,
          allocated_surgeon_id: resAlloc.data.allocated_surgeon_id,
          allocated_proctor_id: resAlloc.data.allocated_proctor_id || 'none',
          estimated_duration_minutes: resAlloc.data.estimated_duration_minutes,
          allocation_status: resAlloc.data.allocation_status,
          is_fallback_allocation: isFallback,
          fallback_reason: resAlloc.data.fallback_reason || '',
          selected_preference_order: resAlloc.data.selected_preference_order,
          original_preference_id: resAlloc.data.original_preference_id,
        })
      }
      setLoading(false)
    })
  }, [id, form])

  const selectedPedidoId = form.watch('pedido_id')

  useEffect(() => {
    if (!selectedPedidoId || loading) return

    supabase
      .from('surgical_request_block_preferences')
      .select(`
        id,
        preference_order,
        surgical_block_id,
        surgical_blocks (
          block_date,
          block_start_time,
          block_end_time,
          surgical_room_id,
          surgical_rooms ( room_name )
        )
      `)
      .eq('pedido_cirurgia_id', selectedPedidoId)
      .order('preference_order', { ascending: true })
      .then(({ data: prefs }) => {
        setPreferences(prefs || [])
      })
  }, [selectedPedidoId, loading])

  const selectedBlockId = form.watch('surgical_block_id')
  const isFallback = form.watch('is_fallback_allocation')

  useEffect(() => {
    if (!selectedBlockId || loading) return
    let roomId = ''

    if (!isFallback) {
      const pref = preferences.find((p) => p.surgical_block_id === selectedBlockId)
      if (pref) {
        form.setValue('selected_preference_order', pref.preference_order)
        form.setValue('original_preference_id', pref.id)
        roomId = pref.surgical_blocks?.surgical_room_id
      }
    } else {
      const block = data.blocks.find((b) => b.id === selectedBlockId)
      if (block) {
        form.setValue('selected_preference_order', null)
        form.setValue('original_preference_id', null)
        roomId = block.surgical_room_id
      }
    }

    if (roomId) form.setValue('surgical_room_id', roomId)
  }, [selectedBlockId, isFallback, preferences, data.blocks, form, loading])

  const executeWithRetry = async (fn: () => Promise<any>, maxRetries = 3) => {
    let attempt = 0
    while (attempt < maxRetries) {
      try {
        const result = await fn()
        if (result.error) throw result.error
        return result
      } catch (error: any) {
        attempt++
        if (attempt >= maxRetries) throw error
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
      }
    }
  }

  const onSubmit = async (values: ResourceAllocationFormValues) => {
    if (!id) return
    const payload = {
      ...values,
      allocated_proctor_id:
        values.allocated_proctor_id === 'none' ? null : values.allocated_proctor_id,
    }

    try {
      await executeWithRetry(async () => {
        return await supabase.from('resource_allocation').update(payload).eq('id', id)
      })
      toast({ title: 'Sucesso', description: 'Alocação atualizada com sucesso!' })
      navigate('/alocacao-recursos')
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Falha na atualização.',
        variant: 'destructive',
      })
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Alocação de Recursos</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pedido_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Pedido Cirúrgico</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''} disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.pedidos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.patients?.full_name || p.id} ({p.status})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Preferências Visuais */}
                {selectedPedidoId && (
                  <div className="col-span-2 mt-2 mb-2">
                    {preferences.length > 0 ? (
                      <div className="bg-slate-50 p-4 rounded-md border">
                        <h3 className="font-medium text-sm text-slate-800 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                          Preferências de Horários do Cirurgião
                          <span className="group relative cursor-help">
                            <Info className="w-4 h-4 text-slate-400" />
                            <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-1">
                              O cirurgião escolheu esses 3 horários como preferência ao criar a
                              solicitação.
                            </div>
                          </span>
                        </h3>
                        <div className="grid gap-2">
                          {preferences.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 text-sm bg-white p-2 rounded border shadow-sm"
                            >
                              <Badge
                                className={
                                  p.preference_order === 1
                                    ? 'bg-blue-500'
                                    : p.preference_order === 2
                                      ? 'bg-orange-500'
                                      : 'bg-pink-500'
                                }
                              >
                                {p.preference_order}ª Preferência
                              </Badge>
                              <span className="font-medium">
                                {formatDate(p.surgical_blocks?.block_date)}
                              </span>
                              <span className="text-slate-600">
                                {p.surgical_blocks?.block_start_time} -{' '}
                                {p.surgical_blocks?.block_end_time}
                              </span>
                              <span className="text-slate-500 ml-auto">
                                Sala: {p.surgical_blocks?.surgical_rooms?.room_name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                          Nenhuma preferência de horário registrada para esta cirurgia.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="is_fallback_allocation"
                  render={({ field }) => (
                    <FormItem className="col-span-2 flex flex-row items-center gap-2 space-y-0 mt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={preferences.length === 0}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-slate-700 cursor-pointer">
                        Alocar em bloco diferente das preferências (Fallback)
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surgical_block_id"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Bloco Cirúrgico{' '}
                        {isFallback
                          ? '(Todos os Disponíveis/Existentes)'
                          : '(Preferências do Cirurgião)'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um bloco..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!isFallback
                            ? preferences.map((p) => (
                                <SelectItem key={p.surgical_block_id} value={p.surgical_block_id}>
                                  [{p.preference_order}ª Preferência]{' '}
                                  {formatDate(p.surgical_blocks?.block_date)} -{' '}
                                  {p.surgical_blocks?.surgical_rooms?.room_name} (
                                  {p.surgical_blocks?.block_start_time})
                                </SelectItem>
                              ))
                            : data.blocks.map((b) => (
                                <SelectItem key={b.id} value={b.id}>
                                  {formatDate(b.block_date)} - Sala:{' '}
                                  {data.rooms.find((r) => r.id === b.surgical_room_id)?.room_name} (
                                  {b.block_start_time})
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isFallback && (
                  <FormField
                    control={form.control}
                    name="fallback_reason"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Motivo do Fallback</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Por que a alocação está sendo feita fora das preferências?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="surgical_room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala Cirúrgica (Auto-preenchido)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''} disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.rooms.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.room_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="robotic_system_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sistema Robótico</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.robots.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.system_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allocated_surgeon_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cirurgião</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allocated_proctor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proctor (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || 'none'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {data.profiles.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_duration_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duração Estimada (min)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allocation_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALOCADO">ALOCADO</SelectItem>
                          <SelectItem value="CONFIRMADO">CONFIRMADO</SelectItem>
                          <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/alocacao-recursos')}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
