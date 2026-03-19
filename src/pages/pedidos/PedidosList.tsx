import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { Plus, Eye } from 'lucide-react'

export default function PedidosList() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const { hasRole } = useAuth()

  useEffect(() => {
    api.pedidos.list().then(({ data }) => {
      if (data) setPedidos(data)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos de Cirurgia</h1>
        {(hasRole('surgeon') || hasRole('secretary')) && (
          <Button asChild>
            <Link to="/pedidos/novo">
              <Plus className="w-4 h-4 mr-2" /> Novo Pedido
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente / Prontuário</TableHead>
                <TableHead>Procedimento</TableHead>
                <TableHead>Data Criação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.patients?.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.patients?.medical_record}
                    </div>
                  </TableCell>
                  <TableCell>{p.procedures?.name}</TableCell>
                  <TableCell>{new Date(p.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/pedidos/${p.id}`}>
                        <Eye className="w-4 h-4 mr-2" /> Ver
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {pedidos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum pedido encontrado.
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
