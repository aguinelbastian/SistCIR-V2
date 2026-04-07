import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { HospitalSelector } from '@/components/hospital/HospitalSelector'

const DAY_OPTIONS = [
  { value: 'MONDAY', label: 'Segunda-feira' },
  { value: 'TUESDAY', label: 'Terça-feira' },
  { value: 'WEDNESDAY', label: 'Quarta-feira' },
  { value: 'THURSDAY', label: 'Quinta-feira' },
  { value: 'FRIDAY', label: 'Sexta-feira' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
]

const formSchema = z
  .object({
    hospital_id: z.string().min(1, 'Selecione o hospital'),
    surgical_room_id: z.string().min(1, 'Selecione a sala'),
    day_of_week: z.string().min(1, 'Selecione o dia'),
    block_start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use o formato HH:MM'),
    block_end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Use o formato HH:MM'),
    is_active: z.boolean().default(true),
    notes: z.string().optional().nullable(),
  })
  .refine((data) => data.block_start_time < data.block_end_time, {
    message: 'Término deve ser após o início',
    path: ['block_end_time'],
  })

type FormData = z.infer<typeof formSchema>

export function SurgicalBlockTemplateForm({ initialData }: { initialData?: any }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      hospital_id: '',
      surgical_room_id: '',
      day_of_week: '',
      block_start_time: '',
      block_end_time: '',
      is_active: true,
      notes: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const roomRes = await supabase
        .from('surgical_rooms')
        .select('id, room_name, hospital_id')
        .eq('is_active', true)
      if (roomRes.data) setRooms(roomRes.data)
    }
    fetchData()
  }, [])

  const selectedHospital = form.watch('hospital_id')
  const filteredRooms = rooms.filter((r) => r.hospital_id === selectedHospital)

  useEffect(() => {
    if (!filteredRooms.find((r) => r.id === form.getValues('surgical_room_id'))) {
      form.setValue('surgical_room_id', '')
    }
  }, [selectedHospital, filteredRooms, form])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('surgical_block_templates' as any)
          .update(data)
          .eq('id', initialData.id)
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Modelo atualizado.' })
      } else {
        const { error } = await supabase.from('surgical_block_templates' as any).insert([data])
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Modelo criado.' })
      }
      navigate('/modelos-blocos')
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hospital_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital</FormLabel>
                <FormControl>
                  <HospitalSelector
                    value={field.value}
                    onChange={field.onChange}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surgical_room_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sala Cirúrgica</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedHospital}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredRooms.map((r) => (
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
            name="day_of_week"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dia da Semana</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DAY_OPTIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="block_start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Início (HH:MM)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="block_end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Término (HH:MM)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Modelo Ativo</FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Modelo'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
