import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, LayoutTemplate } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const DAY_LABELS: Record<string, string> = {
  MONDAY: 'Segunda-feira',
  TUESDAY: 'Terça-feira',
  WEDNESDAY: 'Quarta-feira',
  THURSDAY: 'Quinta-feira',
  FRIDAY: 'Sexta-feira',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
}

export default function SurgicalBlockTemplatesList() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('surgical_block_templates' as any)
        .select(`
          id, day_of_week, block_start_time, block_end_time, is_active,
          surgical_rooms ( room_name ),
          profiles!surgical_block_templates_facility_id_fkey ( name )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error('Error fetching templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeStr: string) => timeStr?.substring(0, 5)

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modelos de Blocos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os modelos recorrentes de blocos cirúrgicos.
          </p>
        </div>
        <Button asChild>
          <Link to="/modelos-blocos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Modelo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary" />
            Modelos Cadastrados
          </CardTitle>
          <CardDescription>
            Lista de todos os modelos de blocos cirúrgicos configurados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Sala</TableHead>
                  <TableHead>Dia da Semana</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Nenhum modelo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((tpl) => (
                    <TableRow key={tpl.id}>
                      <TableCell className="font-medium">{tpl.profiles?.name || 'N/A'}</TableCell>
                      <TableCell>{tpl.surgical_rooms?.room_name || 'N/A'}</TableCell>
                      <TableCell>{DAY_LABELS[tpl.day_of_week] || tpl.day_of_week}</TableCell>
                      <TableCell>
                        {formatTime(tpl.block_start_time)} - {formatTime(tpl.block_end_time)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tpl.is_active ? 'default' : 'secondary'}>
                          {tpl.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/modelos-blocos/${tpl.id}/editar`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
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
