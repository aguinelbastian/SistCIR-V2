import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { HospitalSelector } from '@/components/hospital/HospitalSelector'

const formSchema = z
  .object({
    hospital_id: z.string().min(1, 'Hospital é obrigatório'),
    surgical_room_id: z.string().min(1, 'Sala é obrigatória'),
    block_date: z.string().min(1, 'Data é obrigatória'),
    block_start_time: z.string().min(1, 'Hora de início é obrigatória'),
    block_end_time: z.string().min(1, 'Hora de término é obrigatória'),
    assigned_surgeon_id: z.string().optional(),
    assigned_proctor_id: z.string().optional(),
    is_available: z.boolean().default(true),
    notes: z.string().optional(),
  })
  .refine((data) => data.block_end_time > data.block_start_time, {
    message: 'A hora de término deve ser após a hora de início',
    path: ['block_end_time'],
  })

export default function SurgicalBlockCreate() {
  const navigate = useNavigate()
  const [rooms, setRooms] = useState<any[]>([])
  const [surgeons, setSurgeons] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospital_id: '',
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
      const { data: roomsData } = await supabase
        .from('surgical_rooms')
        .select('id, room_name, hospital_id')
        .eq('is_active', true)
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
    }
    loadDependencies()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        hospital_id: values.hospital_id,
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
      }

      const { error } = await supabase.from('surgical_blocks').insert([payload])
      if (error) throw error

      toast.success('Bloco cirúrgico criado com sucesso')
      navigate('/blocos-cirurgicos')
    } catch (error: any) {
      toast.error('Erro ao criar bloco: ' + error.message)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Novo Bloco Cirúrgico</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hospital_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospital *</FormLabel>
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
                      <FormLabel>Sala Cirúrgica *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!form.watch('hospital_id')}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a sala" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rooms
                            .filter((r) => r.hospital_id === form.watch('hospital_id'))
                            .map((room) => (
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Button type="submit">Criar Bloco</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
