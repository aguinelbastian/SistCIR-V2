import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

const formSchema = z
  .object({
    surgical_room_id: z.string().min(1, 'Sala é obrigatória'),
    block_date: z.string().min(1, 'Data é obrigatória'),
    block_start_time: z.string().min(1, 'Hora de início é obrigatória'),
    block_end_time: z.string().min(1, 'Hora de término é obrigatória'),
    assigned_surgeon_id: z.string().optional(),
    assigned_proctor_id: z.string().optional(),
    is_available: z.boolean(),
    notes: z.string().optional(),
  })
  .refine((data) => data.block_end_time > data.block_start_time, {
    message: 'A hora de término deve ser após a hora de início',
    path: ['block_end_time'],
  })

export default function SurgicalBlockEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [surgeons, setSurgeons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surgical_room_id: '',
      block_date: '',
      block_start_time: '',
      block_end_time: '',
      assigned_surgeon_id: 'none',
      assigned_proctor_id: 'none',
      is_available: true,
      notes: '',
    },
  })

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const { data: roomsData } = await supabase.from('surgical_rooms').select('id, room_name')
        setRooms(roomsData || [])

        const { data: roles } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'surgeon')
        const surgeonIds = roles?.map((r) => r.user_id) || []

        if (surgeonIds.length > 0) {
          const { data: surgeonsData } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', surgeonIds)
          setSurgeons(surgeonsData || [])
        }

        if (id) {
          const { data: block, error } = await supabase
            .from('surgical_blocks')
            .select('*')
            .eq('id', id)
            .single()
          if (error) throw error
          if (block) {
            form.reset({
              surgical_room_id: block.surgical_room_id,
              block_date: block.block_date,
              block_start_time: block.block_start_time.substring(0, 5),
              block_end_time: block.block_end_time.substring(0, 5),
              assigned_surgeon_id: block.assigned_surgeon_id || 'none',
              assigned_proctor_id: block.assigned_proctor_id || 'none',
              is_available: block.is_available,
              notes: block.notes || '',
            })
          }
        }
      } catch (error: any) {
        toast.error('Erro ao carregar dados: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    loadDependencies()
  }, [id, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        surgical_room_id: values.surgical_room_id,
        block_date: values.block_date,
        block_start_time: values.block_start_time,
        block_end_time: values.block_end_time,
        assigned_surgeon_id:
          values.assigned_surgeon_id !== 'none' ? values.assigned_surgeon_id : null,
        assigned_proctor_id:
          values.assigned_proctor_id !== 'none' ? values.assigned_proctor_id : null,
        is_available: values.is_available,
        notes: values.notes || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('surgical_blocks').update(payload).eq('id', id)
      if (error) throw error

      toast.success('Bloco cirúrgico atualizado com sucesso')
      navigate('/blocos-cirurgicos')
    } catch (error: any) {
      toast.error('Erro ao atualizar bloco: ' + error.message)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Bloco Cirúrgico</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="surgical_room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala Cirúrgica *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a sala" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.room_name}
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
                  name="block_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Bloco *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="block_start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hora de Início *</FormLabel>
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
                      <FormLabel>Hora de Término *</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assigned_surgeon_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cirurgião Alocado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhum cirurgião" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Não alocado</SelectItem>
                          {surgeons.map((surgeon) => (
                            <SelectItem key={surgeon.id} value={surgeon.id}>
                              {surgeon.name}
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
                  name="assigned_proctor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proctor Alocado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhum proctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Não alocado</SelectItem>
                          {surgeons.map((surgeon) => (
                            <SelectItem key={surgeon.id} value={surgeon.id}>
                              {surgeon.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Bloco Disponível</FormLabel>
                      <FormDescription>
                        Indica se o bloco pode receber novos agendamentos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações adicionais..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button type="submit">Atualizar Bloco</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
