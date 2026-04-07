import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
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
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'

export default function PreferencesList() {
  const [preferences, setPreferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPreferences = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('surgical_request_block_preferences')
      .select(`
        id,
        preference_order,
        pedidos_cirurgia ( patients ( full_name, medical_record ), procedures ( name ), surgeon_id ),
        surgical_blocks ( block_date, block_start_time, block_end_time, surgical_rooms ( room_name ) ),
        profiles!surgical_request_block_preferences_pedido_cirurgia_id_fkey ( name )
      `)
      .order('created_at', { ascending: false })

    // Fallback if the profiles join fails due to complex relations
    if (error) {
      // Try a simpler query if the deep join fails
      const { data: simpleData, error: simpleError } = await supabase
        .from('surgical_request_block_preferences')
        .select(`
          id,
          preference_order,
          pedidos_cirurgia ( patients ( full_name, medical_record ), procedures ( name ), surgeon_id ),
          surgical_blocks ( block_date, block_start_time, block_end_time, surgical_rooms ( room_name ) )
        `)
        .order('created_at', { ascending: false })

      if (simpleError) {
        toast.error('Erro ao buscar preferências')
      } else {
        setPreferences(simpleData || [])
      }
    } else {
      setPreferences(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPreferences()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta preferência?')) return
    const { error } = await supabase
      .from('surgical_request_block_preferences')
      .delete()
      .eq('id', id)
    if (error) {
      toast.error('Erro ao excluir')
    } else {
      toast.success('Excluído com sucesso')
      fetchPreferences()
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferências de Blocos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as preferências de horários para cirurgias.
          </p>
        </div>
        <Button asChild>
          <Link to="/preferencias-blocos/nova">
            <Plus className="w-4 h-4 mr-2" /> Nova Preferência
          </Link>
        </Button>
      </div>

      <div className="border rounded-md bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente (Prontuário)</TableHead>
              <TableHead>Procedimento</TableHead>
              <TableHead>Bloco Solicitado</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : preferences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhuma preferência encontrada.
                </TableCell>
              </TableRow>
            ) : (
              preferences.map((pref) => (
                <TableRow key={pref.id}>
                  <TableCell className="font-medium">
                    {pref.pedidos_cirurgia?.patients?.full_name} <br />
                    <span className="text-xs text-muted-foreground">
                      {pref.pedidos_cirurgia?.patients?.medical_record}
                    </span>
                  </TableCell>
                  <TableCell>{pref.pedidos_cirurgia?.procedures?.name}</TableCell>
                  <TableCell>
                    {pref.surgical_blocks?.block_date &&
                      format(parseISO(pref.surgical_blocks.block_date), 'dd/MM/yyyy')}{' '}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {pref.surgical_blocks?.block_start_time?.substring(0, 5)} às{' '}
                      {pref.surgical_blocks?.block_end_time?.substring(0, 5)} |{' '}
                      {pref.surgical_blocks?.surgical_rooms?.room_name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        pref.preference_order === 1
                          ? 'bg-blue-500'
                          : pref.preference_order === 2
                            ? 'bg-orange-500'
                            : 'bg-pink-500'
                      }
                    >
                      {pref.preference_order}ª Opção
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(pref.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
