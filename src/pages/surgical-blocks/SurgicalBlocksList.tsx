import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
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
import { Plus, Edit, Trash2, Clock, User, Info } from 'lucide-react'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Segunda',
  TUESDAY: 'Terça',
  WEDNESDAY: 'Quarta',
  THURSDAY: 'Quinta',
  FRIDAY: 'Sexta',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

export default function SurgicalBlocksList() {
  const [blocks, setBlocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTemplate, setFilterTemplate] = useState<string>(
    () => localStorage.getItem('surgical_blocks_filter_template') || 'all',
  )
  const [templates, setTemplates] = useState<any[]>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from('surgical_block_templates')
        .select(`id, day_of_week, surgical_rooms(room_name)`)
        .eq('is_active', true)
      setTemplates(data || [])
    }
    fetchTemplates()
  }, [])

  useEffect(() => {
    localStorage.setItem('surgical_blocks_filter_template', filterTemplate)
    fetchBlocks()
  }, [filterTemplate])

  const fetchBlocks = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('surgical_blocks' as any)
        .select(`
          *,
          surgical_rooms(room_name, room_number),
          assigned_surgeon:profiles!surgical_blocks_assigned_surgeon_id_fkey(name),
          surgical_block_templates(day_of_week, surgical_rooms(room_name))
        `)
        .order('block_date', { ascending: true })
        .order('block_start_time', { ascending: true })

      if (filterTemplate !== 'all') {
        query = query.eq('template_id', filterTemplate)
      }

      const { data, error } = await query

      if (error) throw error
      setBlocks(data || [])
    } catch (error: any) {
      toast.error('Erro ao carregar blocos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este bloco cirúrgico?')) return

    try {
      const { error } = await supabase.from('surgical_blocks').delete().eq('id', id)
      if (error) throw error
      toast.success('Bloco excluído com sucesso')
      fetchBlocks()
    } catch (error: any) {
      toast.error('Erro ao excluir bloco: ' + error.message)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Blocos Cirúrgicos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os blocos de tempo das salas robóticas.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Select value={filterTemplate} onValueChange={setFilterTemplate}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filtrar por template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Blocos</SelectItem>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.surgical_rooms?.room_name} - {DAY_LABELS[t.day_of_week] || t.day_of_week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild>
            <Link to="/blocos-cirurgicos/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Bloco
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Cirurgião</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Carregando blocos...
                    </TableCell>
                  </TableRow>
                ) : blocks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhum bloco cirúrgico encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  blocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">
                        {format(parseISO(block.block_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {block.block_start_time.substring(0, 5)} -{' '}
                          {block.block_end_time.substring(0, 5)}
                        </div>
                      </TableCell>
                      <TableCell>{block.duration_minutes} min</TableCell>
                      <TableCell>{block.surgical_rooms?.room_name || 'N/A'}</TableCell>
                      <TableCell>
                        {block.assigned_surgeon ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {block.assigned_surgeon.name}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Não alocado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {block.template_id ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent"
                            >
                              Template
                            </Badge>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Gerado pelo template:
                                    <br />
                                    {block.surgical_block_templates?.surgical_rooms?.room_name} -{' '}
                                    {DAY_LABELS[block.surgical_block_templates?.day_of_week] ||
                                      block.surgical_block_templates?.day_of_week}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-gray-600 border-gray-300">
                              Manual
                            </Badge>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Criado manualmente.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={block.is_available ? 'default' : 'secondary'}>
                          {block.is_available ? 'Disponível' : 'Reservado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/blocos-cirurgicos/${block.id}/editar`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(block.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
