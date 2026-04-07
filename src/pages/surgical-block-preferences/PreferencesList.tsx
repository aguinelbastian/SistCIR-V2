import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Calendar, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
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

export default function PreferencesList() {
  const [preferences, setPreferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { user, hasRole } = useAuth()

  const fetchPreferences = async () => {
    try {
      setLoading(true)
      const isAdmin = hasRole('admin') || hasRole('facility_manager')

      let query = supabase
        .from('surgical_request_block_preferences')
        .select(`
          id,
          preference_order,
          pedidos_cirurgia!inner (
            id,
            surgeon_id,
            patients ( full_name, medical_record ),
            procedures ( name )
          ),
          surgical_blocks (
            block_date,
            block_start_time,
            block_end_time,
            surgical_rooms ( room_name )
          )
        `)
        .order('created_at', { ascending: false })

      if (!isAdmin && user?.id) {
        query = query.eq('pedidos_cirurgia.surgeon_id', user.id)
      }

      const { data, error } = await query

      if (error) throw error
      setPreferences(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar preferências',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchPreferences()
  }, [user, hasRole])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover esta preferência?')) return

    try {
      const { error } = await supabase
        .from('surgical_request_block_preferences')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({ title: 'Preferência removida com sucesso!' })
      setPreferences((prev) => prev.filter((p) => p.id !== id))
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferências de Blocos</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie as preferências de alocação de blocos cirúrgicos para seus pedidos.
          </p>
        </div>
        <Button asChild>
          <Link to="/preferencias-blocos/nova">
            <Plus className="w-4 h-4 mr-2" /> Nova Preferência
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente (Pedido)</TableHead>
                <TableHead>Procedimento</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Bloco Selecionado</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Carregando preferências...
                  </TableCell>
                </TableRow>
              ) : preferences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma preferência de bloco cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                preferences.map((pref) => (
                  <TableRow key={pref.id}>
                    <TableCell>
                      <div className="font-medium">
                        {pref.pedidos_cirurgia?.patients?.full_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Prontuário: {pref.pedidos_cirurgia?.patients?.medical_record}
                      </div>
                    </TableCell>
                    <TableCell>{pref.pedidos_cirurgia?.procedures?.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          pref.preference_order === 1
                            ? 'bg-blue-100 text-blue-800'
                            : pref.preference_order === 2
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                        }
                      >
                        {pref.preference_order}ª Opção
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pref.surgical_blocks ? (
                        <div className="space-y-1">
                          <div className="flex items-center text-sm font-medium">
                            <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                            {new Date(pref.surgical_blocks.block_date).toLocaleDateString('pt-BR', {
                              timeZone: 'UTC',
                            })}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {pref.surgical_blocks.block_start_time?.substring(0, 5)} às{' '}
                            {pref.surgical_blocks.block_end_time?.substring(0, 5)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pref.surgical_blocks.surgical_rooms?.room_name}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">
                          Bloco não encontrado
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pref.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
        </CardContent>
      </Card>
    </div>
  )
}
