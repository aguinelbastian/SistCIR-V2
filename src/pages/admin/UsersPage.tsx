import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Users } from 'lucide-react'

const roleColors: Record<string, string> = {
  surgeon: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  secretary: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  opme: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  billing: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  coordinator: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  nursing: 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
  admin: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
}

const ALL_ROLES = ['surgeon', 'secretary', 'opme', 'billing', 'coordinator', 'nursing', 'admin']

export default function UsersPage() {
  const { hasRole, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [profiles, setProfiles] = useState<any[]>([])
  const [userRoles, setUserRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [roleToRemove, setRoleToRemove] = useState<any>(null)

  // Edit Profile State
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [editForm, setEditForm] = useState({ name: '', crm: '', is_active: false })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  useEffect(() => {
    if (!authLoading && !hasRole('admin')) {
      navigate('/dashboard')
    }
  }, [authLoading, hasRole, navigate])

  const loadData = async () => {
    setLoading(true)
    const [pRes, rRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_roles').select('*'),
    ])
    if (pRes.data) setProfiles(pRes.data)
    if (rRes.data) setUserRoles(rRes.data)
    setLoading(false)
  }

  useEffect(() => {
    if (hasRole('admin')) {
      loadData()
    }
  }, [hasRole])

  const handleAddRole = async () => {
    if (!selectedUserId || !selectedRole) return
    setIsSubmitting(true)

    const exists = userRoles.find((ur) => ur.user_id === selectedUserId && ur.role === selectedRole)
    if (exists) {
      toast.error('Este usuário já possui este role.')
      setIsSubmitting(false)
      return
    }

    const { error } = await supabase.from('user_roles').insert({
      user_id: selectedUserId,
      role: selectedRole as any,
      is_active: true,
    })

    setIsSubmitting(false)
    if (error) {
      toast.error('Erro ao adicionar role')
    } else {
      toast.success('Role adicionado com sucesso')
      setSelectedUserId('')
      setSelectedRole('')
      loadData()
    }
  }

  const handleToggleStatus = async (ur: any) => {
    if (ur.role === 'admin' && ur.is_active) {
      const activeAdmins = userRoles.filter((r) => r.role === 'admin' && r.is_active)
      if (activeAdmins.length <= 1) {
        toast.error('Operação bloqueada: o sistema requer ao menos um administrador ativo.')
        return
      }
    }

    const { error } = await supabase
      .from('user_roles')
      .update({
        is_active: !ur.is_active,
      })
      .eq('id', ur.id)

    if (error) {
      toast.error('Erro ao atualizar status')
    } else {
      toast.success(ur.is_active ? 'Acesso desativado com sucesso' : 'Acesso ativado com sucesso')
      setUserRoles((prev) =>
        prev.map((r) => (r.id === ur.id ? { ...r, is_active: !ur.is_active } : r)),
      )
    }
  }

  const confirmRemoveRole = async () => {
    if (!roleToRemove) return

    if (roleToRemove.role === 'admin' && roleToRemove.is_active) {
      const activeAdmins = userRoles.filter((r) => r.role === 'admin' && r.is_active)
      if (activeAdmins.length <= 1) {
        toast.error('Operação bloqueada: o sistema requer ao menos um administrador ativo.')
        setRoleToRemove(null)
        return
      }
    }

    const { error } = await supabase.from('user_roles').delete().eq('id', roleToRemove.id)

    if (error) {
      toast.error('Erro ao remover role')
    } else {
      toast.success('Role removido com sucesso')
      loadData()
    }
    setRoleToRemove(null)
  }

  const handleOpenEdit = (profile: any) => {
    if (!profile) return
    setEditingProfile(profile)
    setEditForm({
      name: profile.name || '',
      crm: profile.crm || '',
      is_active: profile.is_active ?? false,
    })
  }

  const handleSaveProfile = async () => {
    if (editForm.name.trim().length < 3) {
      toast.error('O nome deve ter pelo menos 3 caracteres.')
      return
    }

    if (!editForm.is_active && editingProfile.is_active) {
      const isThisUserAdmin = userRoles.some(
        (ur) => ur.user_id === editingProfile.id && ur.role === 'admin' && ur.is_active,
      )

      if (isThisUserAdmin) {
        const activeAdmins = userRoles.filter((ur) => ur.role === 'admin' && ur.is_active)
        const fullyActiveAdmins = activeAdmins.filter((ur) => {
          const prof = profiles.find((p) => p.id === ur.user_id)
          return prof && prof.is_active
        })
        const otherFullyActiveAdmins = fullyActiveAdmins.filter(
          (ur) => ur.user_id !== editingProfile.id,
        )

        if (otherFullyActiveAdmins.length === 0) {
          toast.error('Operação bloqueada: o sistema requer ao menos um administrador ativo.')
          return
        }
      }
    }

    setIsSavingProfile(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        name: editForm.name.trim(),
        crm: editForm.crm.trim(),
        is_active: editForm.is_active,
      })
      .eq('id', editingProfile.id)

    setIsSavingProfile(false)

    if (error) {
      toast.error('Erro ao atualizar perfil')
    } else {
      toast.success('Perfil atualizado com sucesso')
      setProfiles((prev) =>
        prev.map((p) => (p.id === editingProfile.id ? { ...p, ...editForm } : p)),
      )
      setEditingProfile(null)
    }
  }

  if (authLoading || !hasRole('admin')) return null

  const combinedData = userRoles
    .map((ur) => {
      const profile = profiles.find((p) => p.id === ur.user_id)
      return { ...ur, profile }
    })
    .sort((a, b) => {
      const nameA = a.profile?.name || ''
      const nameB = b.profile?.name || ''
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      if (a.role < b.role) return -1
      if (a.role > b.role) return 1
      return 0
    })

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Gerenciamento de Usuários
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os papéis e permissões de acesso do sistema.
        </p>
      </div>

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
                  {[...profiles]
                    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                    .map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name || 'Sem nome'}
                        {p.crm ? ` — ${p.crm}` : ''}
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
                  {ALL_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>CRM</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status Role</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                combinedData.map((ur) => (
                  <TableRow key={ur.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{ur.profile?.name || 'Sem nome'}</span>
                        {!ur.profile?.is_active && (
                          <span className="text-xs text-destructive">Perfil desativado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{ur.profile?.crm || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          roleColors[ur.role] || 'bg-gray-100 text-gray-800 border-gray-200'
                        }
                        variant="outline"
                      >
                        {ur.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={ur.is_active || false}
                        onCheckedChange={() => handleToggleStatus(ur)}
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(ur.profile)}>
                        Editar
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
                ))}
              {!loading && combinedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Remove Role Dialog */}
      <Dialog open={!!roleToRemove} onOpenChange={(o) => !o && setRoleToRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Role</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o role{' '}
              <strong className="text-foreground">{roleToRemove?.role}</strong> do usuário{' '}
              <strong className="text-foreground">
                {roleToRemove?.profile?.name || 'Sem nome'}
              </strong>
              ? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleToRemove(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemoveRole}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={(o) => !o && setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize as informações principais e status global do usuário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome completo</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nome do usuário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-crm">CRM</Label>
              <Input
                id="edit-crm"
                value={editForm.crm}
                onChange={(e) => setEditForm({ ...editForm, crm: e.target.value })}
                placeholder="Ex: 12345-SC"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="edit-active" className="flex flex-col space-y-1 cursor-pointer">
                <span>Perfil ativo</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Permite o acesso geral do usuário ao sistema.
                </span>
              </Label>
              <Switch
                id="edit-active"
                checked={editForm.is_active}
                onCheckedChange={(c) => setEditForm({ ...editForm, is_active: c })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingProfile(null)}
              disabled={isSavingProfile}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
