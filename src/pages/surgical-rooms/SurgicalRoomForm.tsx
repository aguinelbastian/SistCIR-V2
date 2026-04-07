import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

const schema = z.object({
  room_number: z.string().min(1, 'Obrigatório'),
  room_name: z.string().min(1, 'Obrigatório'),
  facility_id: z.string().min(1, 'Obrigatório'),
  robotic_system_id: z.string().optional().nullable(),
  capacity_patients: z.coerce.number().min(1),
  is_active: z.boolean().default(true),
  notes: z.string().optional().nullable(),
})

type FormData = z.infer<typeof schema>

interface Props {
  initialData?: any
  roomId?: string
}

export function SurgicalRoomForm({ initialData, roomId }: Props) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [facilities, setFacilities] = useState<any[]>([])
  const [robots, setRobots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      capacity_patients: 1,
      is_active: true,
      facility_id: user?.id || '',
    },
  })

  useEffect(() => {
    const loadOptions = async () => {
      const [{ data: fData }, { data: rData }] = await Promise.all([
        supabase.from('profiles').select('id, name').order('name'),
        supabase.from('robotic_systems').select('id, system_name').order('system_name'),
      ])
      if (fData) setFacilities(fData)
      if (rData) setRobots(rData)
    }
    loadOptions()
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const payload = {
      ...data,
      robotic_system_id: data.robotic_system_id === 'none' ? null : data.robotic_system_id,
    }

    let error
    if (roomId) {
      const { error: updateErr } = await supabase
        .from('surgical_rooms')
        .update(payload)
        .eq('id', roomId)
      error = updateErr
    } else {
      const { error: insertErr } = await supabase.from('surgical_rooms').insert(payload)
      error = insertErr
    }

    setLoading(false)

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: roomId ? 'Sala atualizada' : 'Sala criada com sucesso' })
      navigate('/salas-cirurgicas')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{roomId ? 'Editar Sala Cirúrgica' : 'Nova Sala Cirúrgica'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número da Sala</Label>
              <Input {...register('room_number')} placeholder="Ex: SALA-01" />
              {errors.room_number && (
                <p className="text-sm text-red-500">{errors.room_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nome da Sala</Label>
              <Input {...register('room_name')} placeholder="Ex: Sala Robótica 1" />
              {errors.room_name && (
                <p className="text-sm text-red-500">{errors.room_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Instalação (Facility)</Label>
              <Select
                value={watch('facility_id')}
                onValueChange={(v) => setValue('facility_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a instalação" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name || f.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.facility_id && (
                <p className="text-sm text-red-500">{errors.facility_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sistema Robótico</Label>
              <Select
                value={watch('robotic_system_id') || 'none'}
                onValueChange={(v) => setValue('robotic_system_id', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum (Opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {robots.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.system_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Capacidade de Pacientes</Label>
              <Input type="number" {...register('capacity_patients')} min={1} />
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <Label>Status</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Switch
                  checked={watch('is_active')}
                  onCheckedChange={(v) => setValue('is_active', v)}
                />
                <span className="text-sm">{watch('is_active') ? 'Ativa' : 'Inativa'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea {...register('notes')} placeholder="Detalhes opcionais..." />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/salas-cirurgicas')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
