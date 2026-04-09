import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

async function hashCPF(cpf: string) {
  const cleanCpf = cpf.replace(/\D/g, '')
  const msgBuffer = new TextEncoder().encode(cleanCpf)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function isValidCPF(cpf: string) {
  const cleanCpf = cpf.replace(/\D/g, '')
  return cleanCpf.length === 11
}

export function CreatePatientModal({
  open,
  onOpenChange,
  onPatientCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPatientCreated: (patient: any) => void
}) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    medical_record: '',
    date_of_birth: '',
    insurance_provider: '',
    insurance_plan: '',
    insurance_card_number: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name || formData.full_name.trim().length < 3) {
      return toast.error('Nome completo é obrigatório e deve ter no mínimo 3 caracteres.')
    }
    if (!formData.cpf || !isValidCPF(formData.cpf)) {
      return toast.error('CPF inválido. Digite os 11 números.')
    }
    if (!formData.medical_record || formData.medical_record.trim().length < 3) {
      return toast.error('Prontuário é obrigatório e deve ter no mínimo 3 caracteres.')
    }

    setLoading(true)
    try {
      const cpf_hash = await hashCPF(formData.cpf)

      const { data: existing, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('cpf_hash', cpf_hash)
        .maybeSingle()

      if (checkError) {
        throw new Error('Erro ao verificar paciente existente.')
      }

      if (existing) {
        toast.error('CPF já cadastrado. Selecione o paciente na lista acima.')
        setLoading(false)
        return
      }

      const newPatientData = {
        full_name: formData.full_name.trim(),
        cpf_hash,
        medical_record: formData.medical_record.trim(),
        date_of_birth: formData.date_of_birth || null,
        insurance_provider: formData.insurance_provider || null,
        insurance_plan: formData.insurance_plan || null,
        insurance_card_number: formData.insurance_card_number || null,
        created_by: user?.id,
      }

      const { data: newPatient, error } = await supabase
        .from('patients')
        .insert(newPatientData)
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          toast.error('CPF já existe (Duplicado). Selecione o paciente na lista acima.')
          return
        }
        if (error.code === '42501') {
          toast.error('Você não tem permissão para criar pacientes.')
          return
        }
        throw new Error(error.message)
      }

      toast.success('Paciente criado com sucesso')
      onPatientCreated(newPatient)
      setFormData({
        full_name: '',
        cpf: '',
        medical_record: '',
        date_of_birth: '',
        insurance_provider: '',
        insurance_plan: '',
        insurance_card_number: '',
      })
    } catch (err: any) {
      console.error(err)
      toast.error('Erro ao criar paciente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Novo Paciente</DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para cadastrar um novo paciente rapidamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="Apenas números"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical_record">Prontuário *</Label>
                <Input
                  id="medical_record"
                  name="medical_record"
                  value={formData.medical_record}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_provider">Convênio / Plano</Label>
                <Input
                  id="insurance_provider"
                  name="insurance_provider"
                  value={formData.insurance_provider}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_plan">Tipo de Plano</Label>
                <Input
                  id="insurance_plan"
                  name="insurance_plan"
                  value={formData.insurance_plan}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance_card_number">Carteirinha</Label>
                <Input
                  id="insurance_card_number"
                  name="insurance_card_number"
                  value={formData.insurance_card_number}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Paciente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
