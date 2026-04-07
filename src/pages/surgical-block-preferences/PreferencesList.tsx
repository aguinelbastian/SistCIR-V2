import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
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
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function PreferencesList() {
  const [preferences, setPreferences] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { hasRole } = useAuth()

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('surgical_request_block_preferences')
        .select(`
          id,
          preference_order,
          pedidos_cirurgia (
            patients ( full_name ),
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

      if (error) throw error
      setPreferences(data || [])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar preferências.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta preferência?')) return
    try {
      const { error } = await supabase
        .from('surgical_request_block_preferences')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Preferência excluída.')
      setPreferences(preferences.filter((p) => p.id !== id))
    } catch (error) {
      console.error(error)
      toast.error('Erro ao excluir preferência.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferências de Blocos</h1>
          <p className="text-muted-foreground">
            Gerencie as preferências de blocos para os pedidos cirúrgicos.
          </p>
        </div>
        <Button asChild>
          <Link to="/preferencias-blocos/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Preferência
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido (Paciente - Procedimento)</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Bloco / Sala</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : preferences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhuma preferência encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                preferences.map((pref) => (
                  <TableRow key={pref.id}>
                    <TableCell>
                      {pref.pedidos_cirurgia?.patients?.full_name} -{' '}
                      {pref.pedidos_cirurgia?.procedures?.name}
                    </TableCell>
                    <TableCell>{pref.preference_order}ª Opção</TableCell>
                    <TableCell>
                      {pref.surgical_blocks ? (
                        <>
                          {new Date(pref.surgical_blocks.block_date).toLocaleDateString('pt-BR', {
                            timeZone: 'UTC',
                          })}{' '}
                          | {pref.surgical_blocks.block_start_time?.substring(0, 5)} às{' '}
                          {pref.surgical_blocks.block_end_time?.substring(0, 5)} |{' '}
                          {pref.surgical_blocks.surgical_rooms?.room_name}
                        </>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {hasRole('admin') && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pref.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
