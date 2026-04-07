import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Trash2 } from 'lucide-react'

const preferenceSchema = z.object({
  pedido_cirurgia_id: z
    .string({ required_error: 'Selecione um pedido cirúrgico' })
    .min(1, 'Selecione um pedido cirúrgico'),
  preferences: z
    .array(
      z.object({
        preference_order: z.coerce.number().int().min(1).max(3),
        surgical_block_id: z
          .string({ required_error: 'Selecione um bloco' })
          .min(1, 'Selecione um bloco'),
      }),
    )
    .min(1, 'Adicione pelo menos uma preferência')
    .max(3, 'Máximo de 3 preferências')
    .refine(
      (prefs) => {
        const blocks = prefs.map((p) => p.surgical_block_id)
        return new Set(blocks).size === blocks.length
      },
      { message: 'Não é permitido selecionar o mesmo bloco mais de uma vez', path: ['root'] },
    )
    .refine(
      (prefs) => {
        const orders = prefs.map((p) => p.preference_order)
        return new Set(orders).size === orders.length
      },
      { message: 'Não é permitido repetir a ordem de preferência', path: ['root'] },
    ),
})

type PreferenceFormValues = z.infer<typeof preferenceSchema>

export default function PreferenceCreate() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [blocks, setBlocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()

  const [hospitalId, setHospitalId] = useState<string>('')

  const form = useForm<PreferenceFormValues>({
    resolver: zodResolver(preferenceSchema),
    defaultValues: {
      pedido_cirurgia_id: '',
      preferences: [{ preference_order: 1, surgical_block_id: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'preferences',
  })

  useEffect(() => {
    async function loadData() {
      try {
        const { data: defaultHospital } = await supabase.rpc('get_default_hospital_id')
        if (defaultHospital) setHospitalId(defaultHospital)

        const isAdmin = hasRole('admin') || hasRole('facility_manager')

        let pedidosQuery = supabase
          .from('pedidos_cirurgia')
          .select('id, scheduled_date, patients(full_name, medical_record), procedures(name)')
          .in('status', [
            '1_RASCUNHO',
            '2_AGUARDANDO_OPME',
            '3_EM_AUDITORIA',
            '4_PENDENCIA_TECNICA',
            '5_AUTORIZADO',
            '6_AGUARDANDO_MAPA',
          ])

        if (!isAdmin && user?.id) {
          pedidosQuery = pedidosQuery.eq('surgeon_id', user.id)
        }

        const { data: pData, error: pError } = await pedidosQuery
        if (pError) throw pError
        if (pData) setPedidos(pData)

        const { data: bData, error: bError } = await supabase
          .from('surgical_blocks')
          .select(`
            id, block_date, block_start_time, block_end_time, is_available, hospital_id,
            surgical_rooms ( room_name )
          `)
          .eq('is_available', true)
          .gte('block_date', new Date().toISOString().split('T')[0])
          .order('block_date', { ascending: true })

        if (bError) throw bError
        if (bData) setBlocks(bData)
      } catch (error: any) {
        toast({
          title: 'Erro ao carregar dados',
          description: error.message,
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) loadData()
  }, [user, hasRole, toast])

  const selectedPedidoId = form.watch('pedido_cirurgia_id')

  const availableBlocks = useMemo(() => {
    const selectedPedido = pedidos.find((p) => p.id === selectedPedidoId)
    const filteredBlocks = hospitalId ? blocks.filter((b) => b.hospital_id === hospitalId) : blocks

    if (!selectedPedido) return filteredBlocks

    const refDate = selectedPedido.scheduled_date
      ? new Date(selectedPedido.scheduled_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

    return filteredBlocks.filter((b) => b.block_date >= refDate)
  }, [hospitalId, selectedPedidoId, pedidos, blocks])

  async function onSubmit(values: PreferenceFormValues) {
    try {
      setIsSubmitting(true)

      if (!hospitalId) throw new Error('Hospital padrão não encontrado')

      const inserts = values.preferences.map((p) => {
        return {
          hospital_id: hospitalId,
          pedido_cirurgia_id: values.pedido_cirurgia_id,
          surgical_block_id: p.surgical_block_id,
          preference_order: p.preference_order,
        }
      })

      const { error } = await supabase.from('surgical_request_block_preferences').insert(inserts)

      if (error) throw error

      toast({ title: 'Preferências salvas com sucesso!' })
      navigate('/preferencias-blocos')
    } catch (error: any) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova Preferência de Bloco</CardTitle>
          <CardDescription>
            Indique os blocos cirúrgicos preferenciais para uma solicitação de cirurgia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pedido_cirurgia_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pedido de Cirurgia</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a cirurgia..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pedidos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.patients?.full_name} ({p.patients?.medical_record}) -{' '}
                              {p.procedures?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Opções de Blocos (Máx. 3)</h3>
                  {fields.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          preference_order: (fields.length + 1) as any,
                          surgical_block_id: '',
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Opção
                    </Button>
                  )}
                </div>

                {form.formState.errors.preferences?.root && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.preferences.root.message}
                  </p>
                )}

                {fields.map((field, index) => (
                  <Card key={field.id} className="border-muted bg-muted/20">
                    <CardContent className="pt-6 pb-4 px-4 flex items-start gap-4">
                      <FormField
                        control={form.control}
                        name={`preferences.${index}.preference_order`}
                        render={({ field }) => (
                          <FormItem className="w-1/4">
                            <FormLabel>Ordem</FormLabel>
                            <Select
                              onValueChange={(val) => field.onChange(parseInt(val))}
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1ª Opção</SelectItem>
                                <SelectItem value="2">2ª Opção</SelectItem>
                                <SelectItem value="3">3ª Opção</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`preferences.${index}.surgical_block_id`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Bloco Disponível</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Escolha um bloco..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableBlocks.map((b) => (
                                  <SelectItem key={b.id} value={b.id}>
                                    {new Date(b.block_date).toLocaleDateString('pt-BR', {
                                      timeZone: 'UTC',
                                    })}{' '}
                                    | {b.block_start_time?.substring(0, 5)} às{' '}
                                    {b.block_end_time?.substring(0, 5)} |{' '}
                                    {b.surgical_rooms?.room_name}
                                  </SelectItem>
                                ))}
                                {availableBlocks.length === 0 && (
                                  <SelectItem value="none" disabled>
                                    Nenhum bloco disponível
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {fields.length > 1 && (
                        <div className="pt-8">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="mb-0.5"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/preferencias-blocos')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Preferências
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
