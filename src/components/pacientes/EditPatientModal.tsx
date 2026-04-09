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

export function EditPatientModal({ open, onOpenChange, patient, onPatientUpdated }: any) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
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
    if (!user?.id || !open) return
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setUserRole(data.role)
      })
  }, [user?.id, open])

  useEffect(() => {
    if (patient && open) {
      setFormData({
        full_name: patient.full_name || '',
        medical_record: patient.medical_record || '',
        date_of_birth: patient.date_of_birth || '',
        insurance_provider: patient.insurance_provider || '',
        insurance_plan: patient.insurance_plan || '',
        insurance_card_number: patient.insurance_card_number || '',
        cns: patient.cns || '',
        profissao: patient.profissao || '',
        endereco: patient.endereco || '',
        telefone: patient.telefone || '',
        pessoa_contato: patient.pessoa_contato || '',
        telefone_contato: patient.telefone_contato || '',
      })
    }
  }, [patient, open])

  const isRequired = userRole && userRole !== 'surgeon'
  const handleChange = (e: any) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || formData.full_name.trim().length < 3)
      return toast.error('Nome completo é obrigatório (mín. 3 caracteres).')
    if (isRequired && (!formData.medical_record || formData.medical_record.trim().length < 3))
      return toast.error('Prontuário é obrigatório para sua função.')
    if (!isRequired && formData.medical_record && formData.medical_record.trim().length < 3)
      return toast.error('Prontuário deve ter no mínimo 3 caracteres.')

    setLoading(true)
    try {
      const updateData = {
        full_name: formData.full_name.trim(),
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
      }
      const { error } = await supabase.from('patients').update(updateData).eq('id', patient.id)
      if (error) throw error
      toast.success('Paciente atualizado com sucesso')
      onPatientUpdated()
    } catch (err: any) {
      toast.error('Erro ao atualizar paciente: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>Altere os dados do paciente abaixo.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="px-6 flex-1">
            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nome Completo *</Label>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prontuário {isRequired && '*'}</Label>
                  <Input
                    name="medical_record"
                    value={formData.medical_record}
                    onChange={handleChange}
                    required={isRequired}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CNS</Label>
                  <Input
                    name="cns"
                    value={formData.cns}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone (Paciente)</Label>
                  <Input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pessoa de Contato</Label>
                  <Input
                    name="pessoa_contato"
                    value={formData.pessoa_contato}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone (Contato)</Label>
                  <Input
                    name="telefone_contato"
                    value={formData.telefone_contato}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Profissão</Label>
                  <Input
                    name="profissao"
                    value={formData.profissao}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Endereço Completo</Label>
                  <Input
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Convênio / Operadora</Label>
                  <Input
                    name="insurance_provider"
                    value={formData.insurance_provider}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Plano</Label>
                  <Input
                    name="insurance_plan"
                    value={formData.insurance_plan}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número da Carteirinha</Label>
                  <Input
                    name="insurance_card_number"
                    value={formData.insurance_card_number}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="p-6 pt-4 border-t bg-muted/20 mt-auto">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
