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
import { useToast } from '@/hooks/use-toast'

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Seg.',
  TUESDAY: 'Ter.',
  WEDNESDAY: 'Qua.',
  THURSDAY: 'Qui.',
  FRIDAY: 'Sex.',
  SATURDAY: 'Sáb.',
  SUNDAY: 'Dom.',
}

const formSchema = z.object({
  surgical_block_template_id: z.string().min(1, 'Selecione o modelo'),
  exception_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),
  reason: z.string().optional().nullable(),
})

type FormData = z.infer<typeof formSchema>

export function SurgicalBlockExceptionForm({ initialData }: { initialData?: any }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      surgical_block_template_id: '',
      exception_date: '',
      reason: '',
    },
  })

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from('surgical_block_templates' as any)
        .select('id, day_of_week, block_start_time, block_end_time, surgical_rooms(room_name)')
        .eq('is_active', true)
      if (data) setTemplates(data)
    }
    fetchTemplates()
  }, [])

  const formatTpl = (t: any) => {
    const room = t.surgical_rooms?.room_name || '?'
    const day = DAY_LABELS[t.day_of_week] || t.day_of_week
    return `${room} - ${day} (${t.block_start_time?.substring(0, 5)} - ${t.block_end_time?.substring(0, 5)})`
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from('surgical_block_exceptions' as any)
          .update(data)
          .eq('id', initialData.id)
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Exceção atualizada.' })
      } else {
        const { error } = await supabase.from('surgical_block_exceptions' as any).insert([data])
        if (error) throw error
        toast({ title: 'Sucesso', description: 'Exceção registrada.' })
      }
      navigate('/excecoes-blocos')
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="surgical_block_template_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo de Bloco Afetado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {formatTpl(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="exception_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data da Exceção</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo (Ex: Feriado, Manutenção)</FormLabel>
                <FormControl>
                  <Input placeholder="Opcional..." {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Exceção'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
