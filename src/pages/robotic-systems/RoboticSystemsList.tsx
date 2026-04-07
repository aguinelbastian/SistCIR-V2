import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { getRoboticSystems, deleteRoboticSystem } from '@/services/robotic-systems'
import { RoboticSystem } from '@/types/sistcir'
import { useAuth } from '@/hooks/use-auth'

export default function RoboticSystemsList() {
  const [systems, setSystems] = useState<RoboticSystem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { hasRole } = useAuth()

  const canManage = hasRole('admin') || hasRole('facility_manager')

  const fetchSystems = async () => {
    try {
      const data = await getRoboticSystems()
      setSystems(data)
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar sistemas robóticos.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSystems()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteRoboticSystem(id)
      toast.success('Sistema robótico excluído com sucesso.')
      setSystems((prev) => prev.filter((s) => s.id !== id))
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao excluir sistema. Pode estar em uso.')
    }
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistemas Robóticos</h1>
          <p className="text-muted-foreground">Gerencie os equipamentos da Vinci da sua unidade.</p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to="/sistemas-roboticos/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Robô
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Sistema</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Manut.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Carregando sistemas...
                  </TableCell>
                </TableRow>
              ) : systems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum sistema robótico cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                systems.map((sys) => (
                  <TableRow key={sys.id}>
                    <TableCell className="font-medium">{sys.system_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sys.model}</Badge>
                    </TableCell>
                    <TableCell>
                      {sys.is_operational ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Operacional</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Inativo</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(sys.last_maintenance_date)}</TableCell>
                    <TableCell className="text-right">
                      {canManage && (
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/sistemas-roboticos/${sys.id}/editar`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Sistema Robótico</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza? Esta ação não poderá ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(sys.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
