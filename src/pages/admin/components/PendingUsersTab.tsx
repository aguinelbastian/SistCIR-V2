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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function PendingUsersTab({
  profiles,
  loading,
  reload,
}: {
  profiles: any[]
  loading: boolean
  reload: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userToReject, setUserToReject] = useState<any>(null)

  const handleApprove = async (userId: string) => {
    setIsSubmitting(true)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', userId)
    const { error: rolesError } = await supabase
      .from('user_roles')
      .update({ is_active: true })
      .eq('user_id', userId)
    setIsSubmitting(false)
    if (profileError || rolesError) {
      toast.error('Erro ao aprovar usuário')
    } else {
      toast.success('Usuário aprovado com sucesso')
      reload()
    }
  }

  const confirmReject = async () => {
    if (!userToReject) return
    setIsSubmitting(true)
    await supabase.from('user_roles').delete().eq('user_id', userToReject.id)
    const { error } = await supabase.from('profiles').delete().eq('id', userToReject.id)
    setIsSubmitting(false)

    if (error) {
      toast.error('Erro ao rejeitar cadastro')
    } else {
      toast.success('Cadastro rejeitado e removido')
      setUserToReject(null)
      reload()
    }
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CRM</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Solicitado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma solicitação pendente no momento.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name || 'Não informado'}</TableCell>
                  <TableCell>{p.crm || '-'}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>
                    {p.requested_at
                      ? new Date(p.requested_at).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(p.id)}
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setUserToReject(p)}
                      disabled={isSubmitting}
                    >
                      Rejeitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!userToReject} onOpenChange={(o) => !o && setUserToReject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar cadastro</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja rejeitar o cadastro de{' '}
              <strong className="text-foreground">{userToReject?.name || 'este usuário'}</strong> (
              {userToReject?.email})? O usuário será removido do sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToReject(null)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={isSubmitting}>
              {isSubmitting ? 'Rejeitando...' : 'Confirmar Rejeição'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
