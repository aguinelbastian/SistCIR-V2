import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
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
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function RoboticSystemCreate() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    system_name: '',
    model: 'da Vinci Xi',
    serial_number: '',
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('robotic_systems').insert([
        {
          system_name: formData.system_name,
          model: formData.model as any,
          serial_number: formData.serial_number || null,
          is_operational: true,
        },
      ])

      if (error) throw error
      toast.success('Sistema robótico criado com sucesso!')
      navigate('/sistemas-roboticos')
    } catch (error: any) {
      toast.error('Erro ao criar sistema robótico: ' + error.message)
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
          <CardTitle>Novo Sistema Robótico</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Sistema</Label>
              <Input
                required
                placeholder="Ex: Robô Principal"
                value={formData.system_name}
                onChange={(e) => setFormData({ ...formData, system_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select
                value={formData.model}
                onValueChange={(val) => setFormData({ ...formData, model: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="da Vinci Xi">da Vinci Xi</SelectItem>
                  <SelectItem value="da Vinci X">da Vinci X</SelectItem>
                  <SelectItem value="da Vinci SP">da Vinci SP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Número de Série (Opcional)</Label>
              <Input
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Criar Sistema'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
