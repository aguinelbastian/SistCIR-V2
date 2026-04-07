import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Edit,
  Trash2,
  Info,
  Calendar as CalendarIcon,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function ResourceAllocationsList() {
  const [allocations, setAllocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [currentDate, setCurrentDate] = useState(new Date())

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
        pedidos_cirurgia ( patients ( full_name, medical_record ), procedures ( name ) ),
        surgical_rooms ( room_name ),
        robotic_systems ( system_name ),
        profiles!resource_allocation_allocated_surgeon_id_fkey ( name ),
        surgical_blocks ( block_date, block_start_time, block_end_time )
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

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alocação de Recursos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e visualize as alocações de recursos cirúrgicos.
          </p>
        </div>
        <Button asChild>
          <Link to="/alocacao-recursos/nova">
            <Plus className="w-4 h-4 mr-2" /> Nova Alocação
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex justify-end mb-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListIcon className="w-4 h-4" /> Lista
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Calendário
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list">
          <div className="border rounded-md bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data e Sala</TableHead>
                  <TableHead>Paciente / Procedimento</TableHead>
                  <TableHead>Cirurgião</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : allocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Nenhuma alocação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  allocations.map((alloc) => (
                    <TableRow key={alloc.id}>
                      <TableCell>
                        <div className="font-semibold text-primary">
                          {alloc.surgical_blocks?.block_date &&
                            format(parseISO(alloc.surgical_blocks.block_date), 'dd/MM/yyyy')}
                        </div>
                        <div className="text-sm font-medium">
                          {alloc.surgical_blocks?.block_start_time?.substring(0, 5)} às{' '}
                          {alloc.surgical_blocks?.block_end_time?.substring(0, 5)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {alloc.surgical_rooms?.room_name} ({alloc.robotic_systems?.system_name})
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {alloc.pedidos_cirurgia?.patients?.full_name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {alloc.pedidos_cirurgia?.procedures?.name}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alloc.profiles?.name}</TableCell>
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
                                ? 'bg-blue-500'
                                : alloc.selected_preference_order === 2
                                  ? 'bg-orange-500'
                                  : 'bg-pink-500'
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
        </TabsContent>

        <TabsContent value="calendar" className="animate-fade-in">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-bold capitalize text-primary">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd')
                const dayAllocations = allocations.filter(
                  (a) =>
                    a.surgical_blocks?.block_date === dayStr && a.allocation_status !== 'CANCELADO',
                )

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'min-h-[140px] p-2 border-r border-b relative',
                      !isSameMonth(day, monthStart) && 'bg-muted/20',
                      isToday(day) && 'bg-primary/5',
                    )}
                  >
                    <div
                      className={cn(
                        'text-right text-sm font-medium mb-1',
                        isToday(day) ? 'text-primary font-bold' : 'text-muted-foreground',
                      )}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[110px] no-scrollbar">
                      {dayAllocations.map((alloc) => {
                        const fullName = alloc.pedidos_cirurgia?.patients?.full_name || ''
                        const initials =
                          fullName
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase() || alloc.pedidos_cirurgia?.patients?.medical_record

                        return (
                          <div
                            key={alloc.id}
                            className="text-[10px] sm:text-xs leading-tight p-1.5 rounded bg-blue-50 border border-blue-200 text-blue-900 shadow-sm hover:shadow-md transition-all cursor-default"
                            title={`Cirurgia: ${alloc.pedidos_cirurgia?.procedures?.name}\nCirurgião: ${alloc.profiles?.name}\nSala: ${alloc.surgical_rooms?.room_name}`}
                          >
                            <div className="font-bold flex justify-between items-center mb-0.5">
                              <span className="text-blue-700">
                                {alloc.surgical_blocks?.block_start_time?.slice(0, 5)}
                              </span>
                              <Badge variant="outline" className="text-[9px] px-1 h-4 bg-white/80">
                                {initials}
                              </Badge>
                            </div>
                            <div className="font-semibold truncate">{alloc.profiles?.name}</div>
                            <div className="truncate opacity-80">
                              {alloc.pedidos_cirurgia?.procedures?.name}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
