import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function PedidoCreate() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [procedimentos, setProcedimentos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    patient_id: '',
    procedure_id: '',
    cid10_primary: '',
    clinical_indication: '',
    asa_classification: 'ASA I',
    estimated_room_time_min: '120',
  })

  useEffect(() => {
    Promise.all([api.pacientes.list(), api.procedimentos.list()]).then(([pRes, procRes]) => {
      if (pRes.data) setPacientes(pRes.data)
      if (procRes.data) setProcedimentos(procRes.data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const { data, error } = await api.pedidos.create({
      ...form,
      surgeon_id: user.id,
      estimated_room_time_min: parseInt(form.estimated_room_time_min),
      status: '1_RASCUNHO',
    })

    setLoading(false)
    if (error) {
      toast.error('Erro ao criar pedido', { description: error.message })
    } else if (data) {
      toast.success('Pedido criado em rascunho!')
      navigate(`/pedidos/${data.id}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Novo Pedido de Cirurgia</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informações Iniciais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paciente</Label>
                <Select
                  value={form.patient_id}
                  onValueChange={(v) => setForm({ ...form, patient_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Procedimento Principal</Label>
                <Select
                  value={form.procedure_id}
                  onValueChange={(v) => setForm({ ...form, procedure_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o procedimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedimentos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>CID-10 Principal</Label>
                <Input
                  required
                  value={form.cid10_primary}
                  onChange={(e) => setForm({ ...form, cid10_primary: e.target.value })}
                  placeholder="Ex: C61"
                />
              </div>
              <div className="space-y-2">
                <Label>Classificação ASA</Label>
                <Select
                  value={form.asa_classification}
                  onValueChange={(v) => setForm({ ...form, asa_classification: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['ASA I', 'ASA II', 'ASA III', 'ASA IV', 'ASA V'].map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Indicação Clínica</Label>
              <Textarea
                required
                value={form.clinical_indication}
                onChange={(e) => setForm({ ...form, clinical_indication: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/pedidos')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Rascunho'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
