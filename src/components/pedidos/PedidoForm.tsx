import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'
import { api } from '@/services/api'
import { supabase } from '@/lib/supabase/client'
import {
  Calendar,
  Check,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { PatientCombobox } from '@/components/pacientes/PatientCombobox'

const formSchema = z.object({
  patient_id: z.string().min(1, 'Selecione um paciente'),
  procedure_id: z.string().min(1, 'Selecione um procedimento'),
  cid10_primary: z.string().min(1, 'CID-10 é obrigatório'),
  clinical_indication: z.string().min(1, 'Indicação clínica é obrigatória'),
  operating_room: z.string().optional(),
  previsao_tempo_minutos: z.coerce.number().min(1, 'Obrigatório'),
  block_preferences: z
    .array(z.string())
    .length(3, 'Você deve selecionar exatamente 3 preferências de horário.')
    .refine(
      (val) => new Set(val).size === val.length,
      'Não é permitido selecionar o mesmo bloco mais de uma vez.',
    ),
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

export function PedidoForm({ onSuccess }: { onSuccess?: () => void }) {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [procedures, setProcedures] = useState<any[]>([])
  const [blocks, setBlocks] = useState<any[]>([])

  const [procedureOpen, setProcedureOpen] = useState(false)

  const [successData, setSuccessData] = useState<{ pedidoId: string; preferences: any[] } | null>(
    null,
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      procedure_id: '',
      cid10_primary: '',
      clinical_indication: '',
      operating_room: '',
      previsao_tempo_minutos: 60,
      block_preferences: [],
    },
  })

  const selectedBlocks = form.watch('block_preferences') || []

  useEffect(() => {
    async function loadData() {
      try {
        const [prRes] = await Promise.all([api.procedimentos.list()])
        if (prRes.data) setProcedures(prRes.data)

        // Fetch blocks available from today onwards using the v_blocos_disponiveis view
        const today = new Date().toISOString().split('T')[0]
        const { data: bData } = await supabase
          .from('v_blocos_disponiveis')
          .select(`
            bloco_id,
            block_date,
            block_start_time,
            block_end_time,
            surgical_room_id,
            hospital_id,
            status_bloco,
            num_cirurgioes_interessados,
            surgical_rooms ( room_name )
          `)
          .gte('block_date', today)
          .order('block_date', { ascending: true })
          .order('block_start_time', { ascending: true })

        if (bData) {
          // Map to match the expected structure for backwards compatibility
          const mappedBlocks = bData.map((b: any) => ({
            id: b.bloco_id,
            block_date: b.block_date,
            block_start_time: b.block_start_time,
            block_end_time: b.block_end_time,
            is_available: b.status_bloco !== 'ALOCADO',
            status_bloco: b.status_bloco,
            num_cirurgioes_interessados: b.num_cirurgioes_interessados,
            surgical_rooms: b.surgical_rooms,
          }))
          setBlocks(mappedBlocks)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }
    loadData()
  }, [])

  async function submitWithRetry(values: any, maxRetries = 3) {
    let lastError = null
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await supabase.functions.invoke('create-pedido-cirurgia', {
          body: values,
        })
        if (response.error) throw response.error
        if (response.data?.code && response.data?.code >= 400) {
          throw new Error(response.data.message || response.data.error)
        }
        return response.data
      } catch (error: any) {
        lastError = error
        if (i === maxRetries - 1) break
        const backoff = Math.pow(2, i) * 1000
        console.warn(`Tentativa ${i + 1} falhou. Tentando novamente em ${backoff}ms...`)
        await sleep(backoff)
      }
    }
    throw lastError
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const prefDetails = values.block_preferences.map((id) => {
        const b = blocks.find((b) => b.id === id)
        return {
          date: formatDate(b.block_date),
          room: b.surgical_rooms?.room_name || 'Desconhecida',
          time: `${b.block_start_time.slice(0, 5)} - ${b.block_end_time.slice(0, 5)}`,
        }
      })

      const payload = {
        ...values,
        surgeon_id: user.id,
        status: '1_RASCUNHO',
        reserva_uti: false,
        anexo_guia_url: 'N/A',
        anexo_guia_tipo: 'pdf',
        alergias_paciente: false,
      }

      const data = await submitWithRetry(payload)

      setSuccessData({ pedidoId: data.pedido_id || data.data?.id, preferences: prefDetails })
      toast.success('Cirurgia criada com 3 preferências de horários registradas!')
    } catch (err: any) {
      console.error('Erro inesperado:', err)
      toast.error('Erro ao criar cirurgia', { description: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSyncGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.events',
          queryParams: { access_type: 'offline', prompt: 'consent' },
          redirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error('Erro ao conectar com Google Calendar', { description: error.message })
    }
  }

  const handleAddBlock = (blockId: string) => {
    if (selectedBlocks.length >= 3) {
      toast.warning('Você já selecionou 3 preferências.')
      return
    }
    if (selectedBlocks.includes(blockId)) {
      toast.warning('Este bloco já foi selecionado.')
      return
    }
    form.setValue('block_preferences', [...selectedBlocks, blockId], { shouldValidate: true })
  }

  const handleRemoveBlock = (blockId: string) => {
    form.setValue(
      'block_preferences',
      selectedBlocks.filter((id) => id !== blockId),
      { shouldValidate: true },
    )
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...selectedBlocks]
    if (direction === 'up' && index > 0) {
      ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      ;[newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]]
    }
    form.setValue('block_preferences', newBlocks, { shouldValidate: true })
  }

  if (successData) {
    return (
      <div className="space-y-6 p-6 border rounded-lg bg-green-50/30 animate-fade-in-up">
        <div className="flex items-center gap-3 text-green-700">
          <Check className="w-8 h-8" />
          <h3 className="text-2xl font-bold">Cirurgia criada com sucesso!</h3>
        </div>
        <p className="text-muted-foreground text-lg">
          Suas 3 preferências de horários foram registradas:
        </p>
        <div className="space-y-3">
          {successData.preferences.map((pref, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-background p-4 rounded-md shadow-sm border"
            >
              <Badge
                className={cn(
                  'text-sm px-3 py-1 text-white border-0',
                  i === 0
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : i === 1
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-rose-500 hover:bg-rose-600',
                )}
              >
                {i + 1}ª Preferência
              </Badge>
              <div className="flex-1 flex flex-col sm:flex-row sm:gap-6 text-base font-medium">
                <span>{pref.date}</span>
                <span className="text-muted-foreground">{pref.room}</span>
                <span>{pref.time}</span>
              </div>
            </div>
          ))}
        </div>
        <Alert className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-800" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            O administrador avaliará sua solicitação e escolherá um desses horários após a aprovação
            final. Você será notificado sobre a decisão.
          </AlertDescription>
        </Alert>
        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            onClick={() => {
              onSuccess?.()
              navigate('/pedidos')
            }}
          >
            Ir para Meus Pedidos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-muted/30 p-4 rounded-lg border gap-4">
          <div>
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Integração Google Calendar
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Sincronize sua agenda pessoal (Opcional, não impede a criação de pedidos)
            </p>
          </div>
          <Button type="button" variant="outline" onClick={handleSyncGoogle}>
            <svg
              className="mr-2 h-4 w-4"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Conectar Google
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Paciente</FormLabel>
                <FormControl>
                  <PatientCombobox
                    value={field.value}
                    onChange={(val) => form.setValue('patient_id', val, { shouldValidate: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="procedure_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Procedimento</FormLabel>
                <Popover open={procedureOpen} onOpenChange={setProcedureOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={procedureOpen}
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <span className="truncate">
                          {field.value
                            ? procedures.find((p) => p.id === field.value)?.name
                            : 'Selecione o procedimento'}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar procedimento..." />
                      <CommandList>
                        <CommandEmpty>Nenhum procedimento encontrado.</CommandEmpty>
                        <CommandGroup>
                          {procedures.map((p) => (
                            <CommandItem
                              key={p.id}
                              value={`${p.name} ${p.tuss_code}`}
                              onSelect={() => {
                                form.setValue('procedure_id', p.id, { shouldValidate: true })
                                setProcedureOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  p.id === field.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{p.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  TUSS: {p.tuss_code}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cid10_primary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CID-10 Principal</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: C61.9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="previsao_tempo_minutos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo Previsto (minutos)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clinical_indication"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Indicação Clínica</FormLabel>
                <FormControl>
                  <Input placeholder="Descreva a indicação cirúrgica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* NOVO: Preferências de Horários */}
          <FormField
            control={form.control}
            name="block_preferences"
            render={() => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-base font-semibold">Preferências de Horários</FormLabel>
                <p className="text-sm text-muted-foreground pb-2">
                  Selecione exatamente 3 blocos cirúrgicos disponíveis e defina a ordem de sua
                  preferência.
                </p>
                <div className="space-y-4 border rounded-md p-4 bg-muted/10">
                  <div className="space-y-2">
                    {selectedBlocks.length === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhum bloco selecionado.</p>
                    )}
                    {selectedBlocks.map((blockId, index) => {
                      const block = blocks.find((b) => b.id === blockId)
                      if (!block) return null
                      return (
                        <div
                          key={blockId}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 bg-background p-3 rounded-md border shadow-sm transition-all"
                        >
                          <Badge
                            className={cn(
                              'self-start sm:self-center text-white border-0',
                              index === 0
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : index === 1
                                  ? 'bg-orange-500 hover:bg-orange-600'
                                  : 'bg-rose-500 hover:bg-rose-600',
                            )}
                          >
                            {index + 1}ª Preferência
                          </Badge>
                          <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <span className="font-medium whitespace-nowrap">
                              {formatDate(block.block_date)}
                            </span>
                            <span className="whitespace-nowrap text-muted-foreground">
                              {block.surgical_rooms?.room_name}
                            </span>
                            <span className="whitespace-nowrap">
                              {block.block_start_time.slice(0, 5)} -{' '}
                              {block.block_end_time.slice(0, 5)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 self-end sm:self-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveBlock(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveBlock(index, 'down')}
                              disabled={index === selectedBlocks.length - 1}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleRemoveBlock(blockId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {selectedBlocks.length < 3 && (
                    <div className="pt-4 border-t">
                      <h5 className="text-sm font-medium mb-3">
                        Blocos Disponíveis para Adicionar:
                      </h5>
                      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2">
                        {blocks
                          .filter((b) => !selectedBlocks.includes(b.id))
                          .map((block) => (
                            <div
                              key={block.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 text-sm border rounded bg-background hover:border-primary/50 transition-colors gap-2"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                  <div
                                    className={cn(
                                      'w-3 h-3 rounded-full shrink-0',
                                      block.status_bloco === 'ALOCADO'
                                        ? 'bg-red-500'
                                        : block.status_bloco === 'RESERVADO_PREFERENCIA'
                                          ? 'bg-yellow-500'
                                          : 'bg-green-500',
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      'font-medium whitespace-nowrap',
                                      block.status_bloco === 'ALOCADO' &&
                                        'line-through text-muted-foreground',
                                    )}
                                  >
                                    {formatDate(block.block_date)}
                                  </span>
                                  <span className="whitespace-nowrap text-muted-foreground">
                                    {block.surgical_rooms?.room_name}
                                  </span>
                                  <span className="whitespace-nowrap font-mono text-xs mt-0.5">
                                    {block.block_start_time.slice(0, 5)} -{' '}
                                    {block.block_end_time.slice(0, 5)}
                                  </span>
                                </div>
                                {block.status_bloco === 'RESERVADO_PREFERENCIA' && (
                                  <span className="text-xs text-yellow-600 font-medium ml-7">
                                    ({block.num_cirurgioes_interessados} cirurgiões interessados)
                                  </span>
                                )}
                                {block.status_bloco === 'ALOCADO' && (
                                  <span className="text-xs text-red-500 font-medium ml-7">
                                    Já alocado
                                  </span>
                                )}
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="shrink-0"
                                disabled={block.status_bloco === 'ALOCADO'}
                                onClick={() => {
                                  if (block.status_bloco === 'ALOCADO') {
                                    toast.error('Este bloco já está alocado. Selecione outro.')
                                    return
                                  }
                                  if (block.status_bloco === 'RESERVADO_PREFERENCIA') {
                                    toast.warning(
                                      `${block.num_cirurgioes_interessados} cirurgiões já demonstraram interesse neste bloco.`,
                                    )
                                  }
                                  handleAddBlock(block.id)
                                }}
                              >
                                <Plus className="w-4 h-4 mr-1" /> Adicionar
                              </Button>
                            </div>
                          ))}
                        {blocks.filter((b) => !selectedBlocks.includes(b.id)).length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            Não há mais blocos disponíveis para seleção.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
            {isSubmitting ? 'Salvando...' : 'Salvar Pedido'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
