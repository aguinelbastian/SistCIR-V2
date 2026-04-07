import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, CalendarOff } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { format, parseISO } from 'date-fns'

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

export default function SurgicalBlockExceptionsList() {
  const [exceptions, setExceptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExceptions()
  }, [])

  const fetchExceptions = async () => {
    try {
      const { data, error } = await supabase
        .from('surgical_block_exceptions' as any)
        .select(`
          id, exception_date, reason,
          surgical_block_templates ( day_of_week, block_start_time, block_end_time, surgical_rooms (room_name) )
        `)
        .order('exception_date', { ascending: false })

      if (error) throw error
      setExceptions(data || [])
    } catch (err) {
      console.error('Error fetching exceptions:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (t: string) => t?.substring(0, 5)

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exceções de Blocos</h1>
          <p className="text-muted-foreground mt-2">Gerencie feriados e datas indisponíveis.</p>
        </div>
        <Button asChild>
          <Link to="/excecoes-blocos/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Exceção
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarOff className="w-5 h-5 text-primary" />
            Exceções Cadastradas
          </CardTitle>
          <CardDescription>
            Lista de datas que foram bloqueadas para agendamento automático.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data da Exceção</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Modelo Vinculado</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : exceptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Nenhuma exceção encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  exceptions.map((exc) => {
                    const tpl = exc.surgical_block_templates
                    const roomName = tpl?.surgical_rooms?.room_name || 'Desconhecida'
                    const day = DAY_LABELS[tpl?.day_of_week] || tpl?.day_of_week
                    const time = `${formatTime(tpl?.block_start_time)} - ${formatTime(tpl?.block_end_time)}`
                    return (
                      <TableRow key={exc.id}>
                        <TableCell className="font-medium">
                          {format(parseISO(exc.exception_date), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>{exc.reason || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {roomName} • {day} ({time})
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/excecoes-blocos/${exc.id}/editar`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
