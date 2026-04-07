import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ResourceAllocationCreate() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pedidos, setPedidos] = useState<any[]>([])
  const [blocks, setBlocks] = useState<any[]>([])
  const [roboticSystems, setRoboticSystems] = useState<any[]>([])
  const [surgeons, setSurgeons] = useState<any[]>([])

  const [formData, setFormData] = useState({
    pedido_id: '',
    surgical_block_id: '',
    robotic_system_id: '',
    allocated_surgeon_id: '',
    estimated_duration_minutes: 60,
  })

  useEffect(() => {
    async function loadData() {
      const [pRes, bRes, rRes, sRes] = await Promise.all([
        supabase
          .from('pedidos_cirurgia')
          .select('id, patients(full_name, medical_record), procedures(name)')
          .in('status', ['5_AUTORIZADO', '6_AGUARDANDO_MAPA']),
        supabase
          .from('v_blocos_disponiveis')
          .select(
            'bloco_id, block_date, block_start_time, block_end_time, surgical_room_id, status_bloco, num_cirurgioes_interessados, surgical_rooms(room_name)',
          )
          .gte('block_date', new Date().toISOString().split('T')[0])
          .order('block_date')
          .order('block_start_time'),
        supabase.from('robotic_systems').select('id, system_name').eq('is_operational', true),
        supabase
          .from('user_roles')
          .select('user_id, profiles!user_roles_user_id_fkey(name)')
          .in('role', ['surgeon', 'admin', 'facility_manager']),
      ])

      if (pRes.data) setPedidos(pRes.data)
      if (bRes.data) setBlocks(bRes.data)
      if (rRes.data) setRoboticSystems(rRes.data)

      // Filter out duplicate profiles
      if (sRes.data) {
        const uniqueSurgeons = Array.from(
          new Map(sRes.data.map((item: any) => [item.user_id, item])).values(),
        )
        setSurgeons(uniqueSurgeons.map((r: any) => ({ id: r.user_id, name: r.profiles?.name })))
      }
    }
    loadData()
  }, [])

  const selectedBlock = blocks.find((b) => b.bloco_id === formData.surgical_block_id)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.pedido_id ||
      !formData.surgical_block_id ||
      !formData.robotic_system_id ||
      !formData.allocated_surgeon_id
    ) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }
    if (selectedBlock?.status_bloco === 'ALOCADO') {
      toast.error('Este bloco já está alocado. Selecione outro.')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('resource_allocation').insert([
        {
          pedido_id: formData.pedido_id,
          surgical_block_id: formData.surgical_block_id,
          surgical_room_id: selectedBlock.surgical_room_id,
          robotic_system_id: formData.robotic_system_id,
          allocated_surgeon_id: formData.allocated_surgeon_id,
          estimated_duration_minutes: formData.estimated_duration_minutes,
          allocated_by: user?.id,
          allocation_status: 'ALOCADO',
        },
      ])

      if (error) throw error
      toast.success('Alocação criada com sucesso!')
      navigate('/alocacao-recursos')
    } catch (err: any) {
      toast.error('Erro ao alocar: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Nova Alocação de Recurso</CardTitle>
          <CardDescription>
            Aloque manualmente salas, robôs e blocos para pedidos autorizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Pedido Cirúrgico (Autorizado / Aguardando Mapa)</Label>
              <Select
                value={formData.pedido_id}
                onValueChange={(v) => setFormData({ ...formData, pedido_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cirurgia..." />
                </SelectTrigger>
                <SelectContent>
                  {pedidos.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.patients?.full_name} ({p.patients?.medical_record}) - {p.procedures?.name}
                    </SelectItem>
                  ))}
                  {pedidos.length === 0 && (
                    <SelectItem value="none" disabled>
                      Nenhum pedido disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bloco Cirúrgico (Horário)</Label>
              <Select
                value={formData.surgical_block_id}
                onValueChange={(v) => {
                  const b = blocks.find((x) => x.bloco_id === v)
                  if (b?.status_bloco === 'ALOCADO') {
                    toast.error('Este bloco já está alocado. Selecione outro.')
                    return
                  }
                  if (b?.status_bloco === 'RESERVADO_PREFERENCIA') {
                    toast.warning(
                      `${b.num_cirurgioes_interessados} cirurgiões interessados neste bloco.`,
                    )
                  }
                  setFormData({ ...formData, surgical_block_id: v })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um bloco..." />
                </SelectTrigger>
                <SelectContent>
                  {blocks.map((b) => {
                    const isAlocado = b.status_bloco === 'ALOCADO'
                    const isReservado = b.status_bloco === 'RESERVADO_PREFERENCIA'
                    return (
                      <SelectItem
                        key={b.bloco_id}
                        value={b.bloco_id}
                        disabled={isAlocado}
                        className={isAlocado ? 'opacity-50 grayscale' : ''}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-3 h-3 rounded-full flex-shrink-0',
                              isAlocado
                                ? 'bg-red-500'
                                : isReservado
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500',
                            )}
                          />
                          <span>
                            {format(parseISO(b.block_date), 'dd/MM/yyyy')} |{' '}
                            {b.block_start_time?.substring(0, 5)} às{' '}
                            {b.block_end_time?.substring(0, 5)} | {b.surgical_rooms?.room_name}
                          </span>
                          {isReservado && (
                            <span className="text-xs text-yellow-600 font-medium ml-2">
                              ({b.num_cirurgioes_interessados} interessados)
                            </span>
                          )}
                          {isAlocado && (
                            <span className="text-xs text-red-500 font-medium ml-2">
                              Já alocado
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    )
                  })}
                  {blocks.length === 0 && (
                    <SelectItem value="none" disabled>
                      Nenhum bloco encontrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sistema Robótico</Label>
                <Select
                  value={formData.robotic_system_id}
                  onValueChange={(v) => setFormData({ ...formData, robotic_system_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roboticSystems.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.system_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cirurgião Responsável</Label>
                <Select
                  value={formData.allocated_surgeon_id}
                  onValueChange={(v) => setFormData({ ...formData, allocated_surgeon_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {surgeons.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duração Estimada (min)</Label>
              <Input
                type="number"
                min={1}
                value={formData.estimated_duration_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Alocando...' : 'Salvar Alocação'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
