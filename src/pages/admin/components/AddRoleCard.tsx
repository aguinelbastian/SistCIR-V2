import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const ALL_ROLES = ['surgeon', 'secretary', 'opme', 'billing', 'coordinator', 'nursing', 'admin']

export default function AddRoleCard({
  profiles,
  userRoles,
  reload,
}: {
  profiles: any[]
  userRoles: any[]
  reload: () => void
}) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddRole = async () => {
    if (!selectedUserId || !selectedRole) return
    setIsSubmitting(true)
    const exists = userRoles.find(
      (ur: any) => ur.user_id === selectedUserId && ur.role === selectedRole,
    )
    if (exists) {
      toast.error('Este usuário já possui este role.')
      setIsSubmitting(false)
      return
    }
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: selectedUserId, role: selectedRole as any, is_active: true })
    setIsSubmitting(false)
    if (error) {
      toast.error('Erro ao adicionar role')
    } else {
      toast.success('Role adicionado com sucesso')
      setSelectedUserId('')
      setSelectedRole('')
      reload()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Role</CardTitle>
        <CardDescription>Atribua um novo papel a um usuário existente.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label>Usuário</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name || 'Sem nome'} {p.crm ? ` — ${p.crm}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um role" />
              </SelectTrigger>
              <SelectContent>
                {ALL_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddRole}
            disabled={!selectedUserId || !selectedRole || isSubmitting}
          >
            Adicionar Role
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
