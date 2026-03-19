import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setUsers(data)
      setLoading(false)
    }
    loadUsers()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administração do Sistema</h1>
        <p className="text-muted-foreground mt-1">Gerenciamento de acessos e papéis de usuário.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Credenciados</CardTitle>
          <CardDescription>
            Lista de todos os usuários registrados na plataforma SistCIR.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Email</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>CRM/Doc</TableHead>
                <TableHead>Status de Acesso</TableHead>
                <TableHead>Data Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[80%]" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.email}</TableCell>
                    <TableCell>
                      {u.name || (
                        <span className="text-muted-foreground italic">Não preenchido</span>
                      )}
                    </TableCell>
                    <TableCell>{u.crm || '-'}</TableCell>
                    <TableCell>
                      {u.is_active ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-amber-700 bg-amber-100 border-amber-200"
                        >
                          Aguardando Ativação
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
