import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export default function SurgicalRoomsList() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { hasRole } = useAuth()
  const { toast } = useToast()

  const canManage = hasRole('admin') || hasRole('facility_manager')

  const fetchRooms = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('surgical_rooms')
      .select('*, profiles(name), robotic_systems(system_name)')
      .order('created_at', { ascending: false })

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    } else {
      setRooms(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta sala?')) return
    const { error } = await supabase.from('surgical_rooms').delete().eq('id', id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Sala excluída com sucesso' })
      fetchRooms()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salas Cirúrgicas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as salas cirúrgicas robóticas da instalação.
          </p>
        </div>
        {canManage && (
          <Button asChild>
            <Link to="/salas-cirurgicas/nova">
              <Plus className="mr-2 h-4 w-4" /> Nova Sala
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Número</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Instalação</TableHead>
                <TableHead>Sistema Robótico</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Status</TableHead>
                {canManage && <TableHead className="text-right">Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma sala encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.room_number}</TableCell>
                    <TableCell>{room.room_name}</TableCell>
                    <TableCell>{room.profiles?.name || 'N/A'}</TableCell>
                    <TableCell>{room.robotic_systems?.system_name || 'N/A'}</TableCell>
                    <TableCell>{room.capacity_patients}</TableCell>
                    <TableCell>
                      {room.is_active ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativa</Badge>
                      ) : (
                        <Badge variant="secondary">Inativa</Badge>
                      )}
                    </TableCell>
                    {canManage && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/salas-cirurgicas/${room.id}/editar`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(room.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
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
