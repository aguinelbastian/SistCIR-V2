import { useState, useEffect } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

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

function isValidPhone(phone: string) {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length === 0 || (cleanPhone.length >= 10 && cleanPhone.length <= 11)
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
  const [userRole, setUserRole] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    medical_record: '',
    date_of_birth: '',
    insurance_provider: '',
    insurance_plan: '',
    insurance_card_number: '',
    cns: '',
    profissao: '',
    endereco: '',
    telefone: '',
    pessoa_contato: '',
    telefone_contato: '',
  })

  useEffect(() => {
    async function fetchRole() {
      if (!user) return
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()
      if (data) {
        setUserRole(data.role)
      }
    }
    if (open) {
      fetchRole()
    }
  }, [user, open])

  const isMedicalRecordRequired = userRole === 'admin' || userRole === 'secretary'

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

    if (isMedicalRecordRequired) {
      if (!formData.medical_record || formData.medical_record.trim().length < 3) {
        return toast.error(
          'Prontuário é obrigatório para sua função e deve ter no mínimo 3 caracteres.',
        )
      }
    } else {
      if (
        formData.medical_record &&
        formData.medical_record.trim().length > 0 &&
        formData.medical_record.trim().length < 3
      ) {
        return toast.error('Prontuário deve ter no mínimo 3 caracteres.')
      }
    }
    if (formData.telefone && !isValidPhone(formData.telefone)) {
      return toast.error('Telefone inválido. Digite o DDD + número (10 ou 11 dígitos).')
    }
    if (formData.telefone_contato && !isValidPhone(formData.telefone_contato)) {
      return toast.error('Telefone de contato inválido. Digite o DDD + número (10 ou 11 dígitos).')
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
        medical_record: formData.medical_record.trim() || null,
        date_of_birth: formData.date_of_birth || null,
        insurance_provider: formData.insurance_provider || null,
        insurance_plan: formData.insurance_plan || null,
        insurance_card_number: formData.insurance_card_number || null,
        cns: formData.cns || null,
        profissao: formData.profissao || null,
        endereco: formData.endereco || null,
        telefone: formData.telefone || null,
        pessoa_contato: formData.pessoa_contato || null,
        telefone_contato: formData.telefone_contato || null,
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
        cns: '',
        profissao: '',
        endereco: '',
        telefone: '',
        pessoa_contato: '',
        telefone_contato: '',
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
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <div className="p-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-xl">Criar Novo Paciente</DialogTitle>
              <DialogDescription>
                Preencha os dados completos para cadastrar um novo paciente no sistema.
              </DialogDescription>
            </DialogHeader>
          </div>

          <ScrollArea className="px-6 flex-1">
            <div className="space-y-8 pb-6 pt-2">
              {/* Seção 1: Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground/90">
                  Dados Pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="full_name">
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="cpf">
                      CPF <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="medical_record">
                      Prontuário{' '}
                      {isMedicalRecordRequired && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="medical_record"
                      name="medical_record"
                      value={formData.medical_record}
                      onChange={handleChange}
                      required={isMedicalRecordRequired}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cns">CNS</Label>
                    <Input
                      id="cns"
                      name="cns"
                      value={formData.cns}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seção 2: Contato */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground/90">
                  Contato
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone (Paciente)</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(DD) 90000-0000"
                      value={formData.telefone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pessoa_contato">Pessoa de Contato</Label>
                    <Input
                      id="pessoa_contato"
                      name="pessoa_contato"
                      value={formData.pessoa_contato}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone_contato">Telefone (Contato)</Label>
                    <Input
                      id="telefone_contato"
                      name="telefone_contato"
                      placeholder="(DD) 90000-0000"
                      value={formData.telefone_contato}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seção 3: Profissão e Endereço */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground/90">
                  Profissão e Endereço
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="profissao">Profissão</Label>
                    <Input
                      id="profissao"
                      name="profissao"
                      value={formData.profissao}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="endereco">Endereço Completo</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Seção 4: Convênio */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground/90">
                  Convênio
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="insurance_provider">Convênio / Operadora</Label>
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
                    <Label htmlFor="insurance_card_number">Número da Carteirinha</Label>
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
            </div>
          </ScrollArea>

          <div className="p-6 pt-4 border-t bg-muted/20 mt-auto">
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="min-w-[140px]">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Criar Paciente'
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
