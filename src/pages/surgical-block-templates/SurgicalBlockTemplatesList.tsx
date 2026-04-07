import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, LayoutTemplate, CalendarDays, AlertTriangle, Zap } from 'lucide-react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

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

  // Modal de geração
  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [exceptionsCount, setExceptionsCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('surgical_block_templates' as any)
        .select(`
          id, day_of_week, block_start_time, block_end_time, is_active,
          surgical_rooms ( room_name )
        `)
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setTemplates(data || [])
    } catch (err) {
      console.error('Error fetching templates:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeStr: string) => timeStr?.substring(0, 5)

  const openGenerateModal = async (tpl: any) => {
    setSelectedTemplate(tpl)
    setExceptionsCount(0)
    setGenerateModalOpen(true)

    try {
      const { count } = await supabase
        .from('surgical_block_exceptions')
        .select('id', { count: 'exact' })
        .eq('surgical_block_template_id', tpl.id)
        .gte('exception_date', new Date().toISOString().split('T')[0])
        .limit(1)

      setExceptionsCount(count || 0)
    } catch (err) {
      console.error('Error fetching exceptions count', err)
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate) return
    setIsGenerating(true)

    try {
      let attempt = 0
      const maxRetries = 3
      let result
      let lastError

      while (attempt < maxRetries) {
        try {
          const { data, error } = await supabase.rpc('fn_generate_recurring_blocks_12months', {
            p_template_id: selectedTemplate.id,
          })
          if (error) throw error
          result = data
          break
        } catch (err: any) {
          lastError = err
          attempt++
          if (attempt < maxRetries) {
            await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 1000))
          }
        }
      }

      if (!result && lastError) {
        throw lastError
      }

      toast.success(`Geração concluída! Blocos criados: ${result?.[0]?.blocks_created || 0}`)
      setGenerateModalOpen(false)
      fetchTemplates()
    } catch (err: any) {
      toast.error('Erro ao gerar blocos: ' + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modelos de Blocos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os modelos recorrentes de blocos cirúrgicos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button asChild>
            <Link to="/modelos-blocos/novo">
              <Plus className="w-4 h-4 mr-2" />
              Novo Modelo
            </Link>
          </Button>
        </div>
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
                    <TableCell colSpan={5} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : templates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nenhum modelo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((tpl) => (
                    <TableRow key={tpl.id}>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openGenerateModal(tpl)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Zap className="w-4 h-4 mr-1" />
                            Gerar
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/modelos-blocos/${tpl.id}/editar`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
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

      <Dialog open={generateModalOpen} onOpenChange={setGenerateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Blocos Recorrentes (12 Meses)</DialogTitle>
            <DialogDescription>
              Confirme os detalhes para geração automática de blocos baseada neste modelo.
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-4 rounded-md">
                <div className="font-semibold text-muted-foreground">Sala:</div>
                <div className="font-medium">
                  {selectedTemplate.surgical_rooms?.room_name || 'N/A'}
                </div>
                <div className="font-semibold text-muted-foreground">Dia da Semana:</div>
                <div className="font-medium">
                  {DAY_LABELS[selectedTemplate.day_of_week] || selectedTemplate.day_of_week}
                </div>
                <div className="font-semibold text-muted-foreground">Horário:</div>
                <div className="font-medium">
                  {formatTime(selectedTemplate.block_start_time)} -{' '}
                  {formatTime(selectedTemplate.block_end_time)}
                </div>
                <div className="font-semibold text-muted-foreground mt-2">Estimativa:</div>
                <div className="font-medium text-primary mt-2">~ 52 blocos serão criados</div>
              </div>

              {exceptionsCount === 0 ? (
                <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    Nenhuma exceção registrada. Todos os dias da semana serão incluídos.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Serão respeitadas <strong>{exceptionsCount}</strong> exceções
                    (feriados/bloqueios) cadastradas.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGenerateModalOpen(false)}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Gerando...
                </>
              ) : (
                'Confirmar Geração'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
