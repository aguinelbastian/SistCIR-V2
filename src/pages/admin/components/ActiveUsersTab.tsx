import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const roleColors: Record<string, string> = {
  surgeon: 'bg-blue-100 text-blue-800 border-blue-200',
  secretary: 'bg-purple-100 text-purple-800 border-purple-200',
  opme: 'bg-orange-100 text-orange-800 border-orange-200',
  billing: 'bg-green-100 text-green-800 border-green-200',
  coordinator: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  nursing: 'bg-pink-100 text-pink-800 border-pink-200',
  admin: 'bg-red-100 text-red-800 border-red-200',
}

export default function ActiveUsersTab({
  profiles,
  userRoles,
  loading,
  reload,
}: {
  profiles: any[]
  userRoles: any[]
  loading: boolean
  reload: () => void
}) {
  const [roleToRemove, setRoleToRemove] = useState<any>(null)
  const [userToReset, setUserToReset] = useState<any>(null)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [editForm, setEditForm] = useState({ name: '', crm: '', is_active: false })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const combinedData = userRoles
    .map((ur: any) => ({ ...ur, profile: profiles.find((p: any) => p.id === ur.user_id) }))
    .filter((ur: any) => ur.profile)
    .sort(
      (a: any, b: any) =>
        (a.profile?.name || '').localeCompare(b.profile?.name || '') ||
        a.role.localeCompare(b.role),
    )

  const handleToggleStatus = async (ur: any) => {
    if (
      ur.role === 'admin' &&
      ur.is_active &&
      userRoles.filter((r: any) => r.role === 'admin' && r.is_active).length <= 1
    )
      return toast.error('O sistema requer ao menos um administrador ativo.')
    const { error } = await supabase
      .from('user_roles')
      .update({ is_active: !ur.is_active })
      .eq('id', ur.id)
    if (error) toast.error('Erro ao atualizar status')
    else {
      toast.success('Status atualizado')
      reload()
    }
  }

  const confirmRemoveRole = async () => {
    if (!roleToRemove) return
    if (
      roleToRemove.role === 'admin' &&
      roleToRemove.is_active &&
      userRoles.filter((r: any) => r.role === 'admin' && r.is_active).length <= 1
    ) {
      setRoleToRemove(null)
      return toast.error('O sistema requer ao menos um administrador ativo.')
    }
    setIsSubmitting(true)
    const { error } = await supabase.from('user_roles').delete().eq('id', roleToRemove.id)
    setIsSubmitting(false)
    if (error) toast.error('Erro ao remover role')
    else {
      toast.success('Role removido')
      setRoleToRemove(null)
      reload()
    }
  }

  const handleSaveProfile = async () => {
    if (editForm.name.trim().length < 3)
      return toast.error('Nome deve ter pelo menos 3 caracteres.')
    setIsSubmitting(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name: editForm.name, crm: editForm.crm, is_active: editForm.is_active })
      .eq('id', editingProfile.id)
    setIsSubmitting(false)
    if (error) toast.error('Erro ao atualizar perfil')
    else {
      toast.success('Perfil atualizado')
      setEditingProfile(null)
      reload()
    }
  }

  const confirmResetPassword = async () => {
    setIsSubmitting(true)
    const { error } = await supabase.functions.invoke('admin-reset-password', {
      body: { user_email: userToReset.email },
    })
    setIsSubmitting(false)
    if (error) toast.error('Erro ao enviar e-mail. Tente novamente.')
    else {
      toast.success(`E-mail de redefinição enviado para ${userToReset.email}`)
      setUserToReset(null)
    }
  }

  return (
    <div className="border rounded-lg bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CRM</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Último Acesso</TableHead>
            <TableHead>Status Role</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Carregando...
              </TableCell>
            </TableRow>
          ) : combinedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            combinedData.map((ur: any) => (
              <TableRow key={ur.id}>
                <TableCell className="font-medium">{ur.profile?.name || 'Sem nome'}</TableCell>
                <TableCell>{ur.profile?.crm || '-'}</TableCell>
                <TableCell>
                  <Badge
                    className={roleColors[ur.role] || 'bg-gray-100 border-gray-200'}
                    variant="outline"
                  >
                    {ur.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ur.profile?.last_sign_in_at ? (
                    new Date(ur.profile.last_sign_in_at).toLocaleString('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })
                  ) : (
                    <Badge
                      variant="secondary"
                      className="font-normal text-xs text-muted-foreground border-transparent"
                    >
                      Nunca acessou
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={ur.is_active || false}
                    onCheckedChange={() => handleToggleStatus(ur)}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingProfile(ur.profile)
                      setEditForm({
                        name: ur.profile.name || '',
                        crm: ur.profile.crm || '',
                        is_active: ur.profile.is_active,
                      })
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => setUserToReset(ur.profile)}
                  >
                    Resetar Senha
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setRoleToRemove(ur)}
                  >
                    Remover Role
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!roleToRemove} onOpenChange={(o) => !o && setRoleToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Role</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Remover <strong>{roleToRemove?.role}</strong> do usuário{' '}
            <strong>{roleToRemove?.profile?.name}</strong>?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleToRemove(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemoveRole} disabled={isSubmitting}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!userToReset} onOpenChange={(o) => !o && setUserToReset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar senha</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Enviar e-mail de redefinição de senha para <strong>{userToReset?.name}</strong> (
            {userToReset?.email})?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToReset(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={confirmResetPassword}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar E-mail'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProfile} onOpenChange={(o) => !o && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CRM</Label>
              <Input
                value={editForm.crm}
                onChange={(e) => setEditForm({ ...editForm, crm: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label>Perfil ativo</Label>
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(c) => setEditForm({ ...editForm, is_active: c })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProfile(null)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
