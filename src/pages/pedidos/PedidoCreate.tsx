import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { CalendarIcon, ChevronLeft } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default function PedidoCreate() {
  const { user, roles, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [pacientes, setPacientes] = useState<any[]>([])
  const [procedimentos, setProcedimentos] = useState<any[]>([])
  const [cirurgioes, setCirurgioes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    patient_id: '',
    procedure_id: '',
    surgeon_id: '',
    clinical_summary: '',
  })
  const [scheduledDate, setScheduledDate] = useState<Date>()

  const isSurgeon = roles.includes('surgeon')
  const isAdmin = roles.includes('admin')
  const isSecretary = roles.includes('secretary')
  const isAuthorized = isSurgeon || isSecretary || isAdmin
  const disableSurgeonField = isSurgeon && !isSecretary && !isAdmin

  useEffect(() => {
    if (authLoading) return
    if (!isAuthorized) {
      toast.error('Acesso negado. Apenas cirurgiões e secretárias podem criar pedidos.')
      navigate('/dashboard')
    }
  }, [authLoading, isAuthorized, navigate])

  useEffect(() => {
    if (authLoading || !isAuthorized) return

    Promise.all([api.pacientes.list(), api.procedimentos.list(), api.profiles.listActive()]).then(
      ([pRes, procRes, cirRes]) => {
        if (pRes.data) setPacientes(pRes.data)
        if (procRes.data) setProcedimentos(procRes.data)
        if (cirRes.data) setCirurgioes(cirRes.data)

        if (isSurgeon && user) {
          setForm((f) => ({ ...f, surgeon_id: user.id }))
        }
      },
    )
  }, [authLoading, isAuthorized, isSurgeon, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!form.patient_id || !form.procedure_id || !form.surgeon_id) return

    setLoading(true)

    const { error } = await api.pedidos.create({
      patient_id: form.patient_id,
      procedure_id: form.procedure_id,
      surgeon_id: form.surgeon_id,
      status: '1_RASCUNHO',
      cid10_primary: 'Pendente',
      clinical_indication: 'N/A',
      clinical_summary: form.clinical_summary || null,
      scheduled_date: scheduledDate ? scheduledDate.toISOString() : null,
    })

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Pedido criado com sucesso')
      navigate('/dashboard')
    }
  }

  const isValid = form.patient_id && form.procedure_id && form.surgeon_id
  const summaryLength = form.clinical_summary.length

  if (authLoading || !isAuthorized) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Pedido de Cirurgia</h1>
          <p className="text-muted-foreground mt-1">
            Preencha os dados iniciais para criar a solicitação.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-muted">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  Paciente <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.patient_id}
                  onValueChange={(v) => setForm({ ...form, patient_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.medical_record} — {p.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Procedimento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.procedure_id}
                  onValueChange={(v) => setForm({ ...form, procedure_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o procedimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedimentos.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} (TUSS: {p.tuss_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Cirurgião Responsável <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.surgeon_id}
                  onValueChange={(v) => setForm({ ...form, surgeon_id: v })}
                  disabled={disableSurgeonField}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cirurgião" />
                  </SelectTrigger>
                  <SelectContent>
                    {cirurgioes.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name || 'Sem nome'} — CRM: {p.crm || 'N/I'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Agendada (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !scheduledDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? (
                        format(scheduledDate, 'dd/MM/yyyy')
                      ) : (
                        <span>DD/MM/AAAA</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2 pt-2 border-t mt-2">
                <div className="flex justify-between items-center mt-2">
                  <Label>Observações Clínicas (Opcional)</Label>
                  <span
                    className={cn(
                      'text-xs',
                      summaryLength > 1000
                        ? 'text-destructive font-bold'
                        : 'text-muted-foreground font-medium',
                    )}
                  >
                    {summaryLength}/1000
                  </span>
                </div>
                <Textarea
                  placeholder="Observações clínicas relevantes..."
                  value={form.clinical_summary}
                  onChange={(e) => setForm({ ...form, clinical_summary: e.target.value })}
                  maxLength={1000}
                  rows={4}
                  className={cn(
                    summaryLength > 1000 && 'border-destructive focus-visible:ring-destructive',
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!isValid || loading || summaryLength > 1000}
                className="min-w-[120px]"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
