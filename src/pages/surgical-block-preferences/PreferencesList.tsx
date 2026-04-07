import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { SurgicalBlockPreference } from '@/types/sistcir'
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
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import { HospitalSelector } from '@/components/hospital/HospitalSelector'

export default function PreferencesList() {
  const [preferences, setPreferences] = useState<SurgicalBlockPreference[]>([])
  const [loading, setLoading] = useState(true)
  const [filterHospital, setFilterHospital] = useState<string>('all')
  const { toast } = useToast()
  const { hasRole } = useAuth()
  const canDelete = hasRole('admin') || hasRole('facility_manager')

  useEffect(() => {
    loadPreferences()
  }, [filterHospital])

  async function loadPreferences() {
    try {
      setLoading(true)
      let query = supabase
        .from('surgical_request_block_preferences')
        .select(`
          *,
          hospitals(hospital_name),
          pedidos_cirurgia (
            patients ( full_name, medical_record ),
            procedures ( name )
          ),
          surgical_blocks (
            block_date, block_start_time, block_end_time,
            surgical_rooms ( room_name )
          )
        `)
        .order('created_at', { ascending: false })

      if (filterHospital !== 'all') {
        query = query.eq('hospital_id', filterHospital)
      }

      const { data, error } = await query
      if (error) throw error
      setPreferences(data as any[])
    } catch (error: any) {
      toast({ title: 'Erro ao carregar', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm('Tem certeza que deseja remover esta preferência? Esta ação não pode ser desfeita.')
    )
      return
    try {
      const { error } = await supabase
        .from('surgical_request_block_preferences')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast({ title: 'Removido com sucesso' })
      loadPreferences()
    } catch (error: any) {
      toast({ title: 'Erro ao remover', description: error.message, variant: 'destructive' })
    }
  }

  const getOrderBadge = (order: number) => {
    switch (order) {
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600">1ª Opção</Badge>
      case 2:
        return <Badge className="bg-blue-500 hover:bg-blue-600">2ª Opção</Badge>
      case 3:
        return <Badge className="bg-amber-500 hover:bg-amber-600">3ª Opção</Badge>
      default:
        return <Badge variant="outline">{order}ª Opção</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Preferências de Blocos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as preferências de blocos cirúrgicos para as solicitações.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-[280px]">
            <HospitalSelector value={filterHospital} onValueChange={setFilterHospital} allowAll />
          </div>
          <Button asChild>
            <Link to="/preferencias-blocos/nova">
              <Plus className="w-4 h-4 mr-2" />
              Nova Preferência
            </Link>
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hospital</TableHead>
              <TableHead>Paciente / Procedimento</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Bloco Solicitado</TableHead>
              <TableHead>Data Criação</TableHead>
              {canDelete && <TableHead className="w-[80px] text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {preferences.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canDelete ? 5 : 4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma preferência registrada.
                </TableCell>
              </TableRow>
            ) : (
              preferences.map((pref) => (
                <TableRow key={pref.id}>
                  <TableCell className="font-medium">
                    {pref.hospitals?.hospital_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {pref.pedidos_cirurgia?.patients?.full_name || 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {pref.pedidos_cirurgia?.procedures?.name || 'N/A'}
                      (Prontuário: {pref.pedidos_cirurgia?.patients?.medical_record || 'N/A'})
                    </div>
                  </TableCell>
                  <TableCell>{getOrderBadge(pref.preference_order)}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {pref.surgical_blocks?.block_date
                        ? new Date(pref.surgical_blocks.block_date).toLocaleDateString('pt-BR', {
                            timeZone: 'UTC',
                          })
                        : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {pref.surgical_blocks?.surgical_rooms?.room_name || 'Sala N/A'} •{' '}
                      {pref.surgical_blocks?.block_start_time?.substring(0, 5)} às{' '}
                      {pref.surgical_blocks?.block_end_time?.substring(0, 5)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(pref.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  {canDelete && (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(pref.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
