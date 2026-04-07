import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { resourceAllocationSchema, type ResourceAllocationFormValues } from './schema'

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
  const [loading, setLoading] = useState(true)

  const form = useForm<ResourceAllocationFormValues>({
    resolver: zodResolver(resourceAllocationSchema),
    defaultValues: {
      estimated_duration_minutes: 60,
      allocation_status: 'ALOCADO',
      allocated_proctor_id: 'none',
    },
  })

  useEffect(() => {
    if (!id) return

    Promise.all([
      supabase.from('pedidos_cirurgia').select('id, patients(full_name)').limit(50),
      supabase.from('surgical_rooms').select('id, room_name'),
      supabase.from('robotic_systems').select('id, system_name'),
      supabase.from('surgical_blocks').select('id, block_date, block_start_time'),
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
        form.reset({
          pedido_id: resAlloc.data.pedido_id,
          surgical_room_id: resAlloc.data.surgical_room_id,
          robotic_system_id: resAlloc.data.robotic_system_id,
          surgical_block_id: resAlloc.data.surgical_block_id,
          allocated_surgeon_id: resAlloc.data.allocated_surgeon_id,
          allocated_proctor_id: resAlloc.data.allocated_proctor_id || 'none',
          estimated_duration_minutes: resAlloc.data.estimated_duration_minutes,
          allocation_status: resAlloc.data.allocation_status,
        })
      }
      setLoading(false)
    })
  }, [id, form])

  const onSubmit = async (values: ResourceAllocationFormValues) => {
    if (!id) return
    const payload = {
      ...values,
      allocated_proctor_id:
        values.allocated_proctor_id === 'none' ? null : values.allocated_proctor_id,
    }

    const { error } = await supabase.from('resource_allocation').update(payload).eq('id', id)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sucesso', description: 'Alocação atualizada com sucesso' })
      navigate('/alocacao-recursos')
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
                    <FormItem>
                      <FormLabel>Pedido Cirúrgico</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.pedidos.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.patients?.full_name || p.id}
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
                  name="surgical_room_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sala Cirúrgica</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  name="surgical_block_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bloco Cirúrgico</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {data.blocks.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.block_date} - {b.block_start_time}
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
