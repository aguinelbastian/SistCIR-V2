import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Info } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
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

export default function ResourceAllocationsList() {
  const [allocations, setAllocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchAllocations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('resource_allocation')
      .select(`
        id,
        allocation_status,
        estimated_duration_minutes,
        selected_preference_order,
        is_fallback_allocation,
        fallback_reason,
        pedidos_cirurgia ( patients ( full_name ) ),
        surgical_rooms ( room_name ),
        robotic_systems ( system_name ),
        profiles!resource_allocation_allocated_surgeon_id_fkey ( name )
      `)
      .order('allocated_at', { ascending: false })

    if (error) {
      toast({
        title: 'Erro ao buscar alocações',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setAllocations(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAllocations()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta alocação?')) return
    const { error } = await supabase.from('resource_allocation').delete().eq('id', id)
    if (error) {
      toast({ title: 'Erro ao excluir', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Alocação excluída com sucesso' })
      fetchAllocations()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alocação de Recursos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as alocações de recursos cirúrgicos.
          </p>
        </div>
        <Button asChild>
          <Link to="/alocacao-recursos/nova">
            <Plus className="w-4 h-4 mr-2" /> Nova Alocação
          </Link>
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente (Pedido)</TableHead>
              <TableHead>Sala / Robô</TableHead>
              <TableHead>Cirurgião</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Tipo de Alocação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : allocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Nenhuma alocação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              allocations.map((alloc) => (
                <TableRow key={alloc.id}>
                  <TableCell className="font-medium">
                    {alloc.pedidos_cirurgia?.patients?.full_name}
                  </TableCell>
                  <TableCell>
                    <div>{alloc.surgical_rooms?.room_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {alloc.robotic_systems?.system_name}
                    </div>
                  </TableCell>
                  <TableCell>{alloc.profiles?.name}</TableCell>
                  <TableCell>{alloc.estimated_duration_minutes} min</TableCell>
                  <TableCell>
                    {alloc.is_fallback_allocation ? (
                      <div className="flex items-center group relative cursor-help">
                        <Badge
                          variant="secondary"
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                        >
                          Fallback <Info className="w-3 h-3 ml-1" />
                        </Badge>
                        <div className="hidden group-hover:block absolute z-10 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg bottom-full left-1/2 -translate-x-1/2 mb-1">
                          <p className="font-semibold">Alocado fora das preferências</p>
                          <p className="mt-1 opacity-90">
                            Motivo: {alloc.fallback_reason || 'Não informado'}
                          </p>
                        </div>
                      </div>
                    ) : alloc.selected_preference_order ? (
                      <Badge
                        className={
                          alloc.selected_preference_order === 1
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : alloc.selected_preference_order === 2
                              ? 'bg-orange-500 hover:bg-orange-600'
                              : 'bg-pink-500 hover:bg-pink-600'
                        }
                      >
                        {alloc.selected_preference_order}ª Preferência
                      </Badge>
                    ) : (
                      <Badge variant="outline">Normal</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alloc.allocation_status === 'CANCELADO'
                          ? 'destructive'
                          : alloc.allocation_status === 'CONFIRMADO'
                            ? 'default'
                            : 'outline'
                      }
                    >
                      {alloc.allocation_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/alocacao-recursos/${alloc.id}/editar`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(alloc.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
