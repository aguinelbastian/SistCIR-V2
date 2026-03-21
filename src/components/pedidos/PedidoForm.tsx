import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { toast } from 'sonner'
import { api } from '@/services/api'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  patient_id: z.string().min(1, 'Selecione um paciente'),
  procedure_id: z.string().min(1, 'Selecione um procedimento'),
  cid10_primary: z.string().min(1, 'CID-10 é obrigatório'),
  clinical_indication: z.string().min(1, 'Indicação clínica é obrigatória'),
  operating_room: z.string().optional(),
  previsao_tempo_minutos: z.coerce.number().min(1, 'Obrigatório'),
})

export function PedidoForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [procedures, setProcedures] = useState<any[]>([])

  const [patientOpen, setPatientOpen] = useState(false)
  const [procedureOpen, setProcedureOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: '',
      procedure_id: '',
      cid10_primary: '',
      clinical_indication: '',
      operating_room: '',
      previsao_tempo_minutos: 60,
    },
  })

  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, prRes] = await Promise.all([api.pacientes.list(), api.procedimentos.list()])
        if (pRes.data) setPatients(pRes.data)
        if (prRes.data) setProcedures(prRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }
    loadData()
  }, [])

  async function onSubmit() {
    setIsSubmitting(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Não autenticado')

      const { data, error } = await supabase.functions.invoke('create-pedido-cirurgia', {
        body: {
          patient_id: form.getValues('patient_id'),
          procedure_id: form.getValues('procedure_id'),
          cid10_primary: form.getValues('cid10_primary'),
          clinical_indication: form.getValues('clinical_indication'),
          operating_room: form.getValues('operating_room'),
          previsao_tempo_minutos: form.getValues('previsao_tempo_minutos'),
          surgeon_id: user.id,
          status: '1_RASCUNHO',
          datas_propostas: [
            { data: new Date().toISOString().split('T')[0], turno: 'manhã' },
            { data: new Date().toISOString().split('T')[0], turno: 'tarde' },
            { data: new Date().toISOString().split('T')[0], turno: 'manhã' },
          ],
          reserva_uti: false,
          anexo_guia_url: 'N/A',
          anexo_guia_tipo: 'pdf',
          alergias_paciente: false,
        },
      })

      if (error) {
        console.error('Erro ao criar cirurgia:', error)
        toast.error(`Erro: ${error.message}`)
        return
      }

      if (data?.error) {
        console.error('Erro ao criar cirurgia:', data.error)
        toast.error(`Erro: ${data.error}`)
        return
      }

      toast.success('Cirurgia criada com sucesso!')
      onSuccess?.()
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
                <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={patientOpen}
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <span className="truncate">
                          {field.value
                            ? patients.find((p) => p.id === field.value)?.full_name
                            : 'Selecione o paciente'}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar paciente..." />
                      <CommandList>
                        <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
                        <CommandGroup>
                          {patients.map((p) => (
                            <CommandItem
                              key={p.id}
                              value={`${p.full_name} ${p.medical_record}`}
                              onSelect={() => {
                                form.setValue('patient_id', p.id, { shouldValidate: true })
                                setPatientOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  p.id === field.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {p.full_name} ({p.medical_record})
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
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? 'Salvando...' : 'Salvar Pedido'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
