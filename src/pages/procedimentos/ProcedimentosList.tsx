import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function ProcedimentosList() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { hasRole } = useAuth()

  const canCreate = hasRole('admin') || hasRole('nursing')

  const [formData, setFormData] = useState({
    tuss_code: '',
    name: '',
    surgical_time_minutes: 60,
    setup_time_minutes: 30,
    requires_robot: true,
    requires_proctor: false,
  })

  const fetchProcedimentos = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from('procedures').select('*').order('name')
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error(error)
      toast.error('Erro ao carregar procedimentos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProcedimentos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.tuss_code) {
      toast.error('Nome e TUSS são obrigatórios')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('procedures').insert([formData])
      if (error) throw error

      toast.success('Procedimento criado com sucesso!')
      setIsDialogOpen(false)
      setFormData({
        tuss_code: '',
        name: '',
        surgical_time_minutes: 60,
        setup_time_minutes: 30,
        requires_robot: true,
        requires_proctor: false,
      })
      fetchProcedimentos()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Erro ao criar procedimento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procedimentos</h1>
          <p className="text-muted-foreground">Catálogo de procedimentos cirúrgicos do sistema.</p>
        </div>

        {canCreate && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Procedimento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Novo Procedimento</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tuss_code">Código TUSS *</Label>
                    <Input
                      id="tuss_code"
                      value={formData.tuss_code}
                      onChange={(e) => setFormData({ ...formData, tuss_code: e.target.value })}
                      placeholder="Ex: 31005462"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Procedimento *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Prostatectomia Radical"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="surgical_time_minutes">Tempo Cirúrgico (min) *</Label>
                      <Input
                        id="surgical_time_minutes"
                        type="number"
                        min="1"
                        value={formData.surgical_time_minutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            surgical_time_minutes: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="setup_time_minutes">Tempo Setup (min)</Label>
                      <Input
                        id="setup_time_minutes"
                        type="number"
                        min="0"
                        value={formData.setup_time_minutes}
                        onChange={(e) =>
                          setFormData({ ...formData, setup_time_minutes: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <Label htmlFor="requires_robot" className="cursor-pointer">
                      Requer Robô?
                    </Label>
                    <Switch
                      id="requires_robot"
                      checked={formData.requires_robot}
                      onCheckedChange={(val) => setFormData({ ...formData, requires_robot: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requires_proctor" className="cursor-pointer">
                      Requer Proctor?
                    </Label>
                    <Switch
                      id="requires_proctor"
                      checked={formData.requires_proctor}
                      onCheckedChange={(val) => setFormData({ ...formData, requires_proctor: val })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TUSS</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tempo (min)</TableHead>
                <TableHead>Requer Robô</TableHead>
                <TableHead>Requer Proctor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum procedimento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-muted-foreground">{p.tuss_code}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.surgical_time_minutes}m</TableCell>
                    <TableCell>
                      {p.requires_robot ? (
                        <Badge>Sim</Badge>
                      ) : (
                        <Badge variant="secondary">Não</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.requires_proctor ? (
                        <Badge variant="destructive">Sim</Badge>
                      ) : (
                        <Badge variant="outline">Não</Badge>
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
