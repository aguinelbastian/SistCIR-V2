import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function ProcedimentosList() {
  const [procedimentos, setProcedimentos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [canEdit, setCanEdit] = useState(false)

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    tuss_code: '',
    surgical_time_minutes: 60,
    setup_time_minutes: 30,
    requires_robot: true,
    requires_proctor: false,
  })

  useEffect(() => {
    async function checkRole() {
      const { data } = await supabase.rpc('get_user_roles')
      if (
        data &&
        (data.includes('admin') || data.includes('nursing') || data.includes('facility_manager'))
      ) {
        setCanEdit(true)
      }
    }
    checkRole()
    fetchProcedimentos()
  }, [])

  const fetchProcedimentos = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('procedures').select('*').order('name')

    if (error) {
      toast.error('Erro ao buscar procedimentos')
    } else {
      setProcedimentos(data || [])
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este procedimento?')) return
    const { error } = await supabase.from('procedures').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir: ' + error.message)
    } else {
      toast.success('Procedimento excluído com sucesso')
      fetchProcedimentos()
    }
  }

  const openForm = (proc?: any) => {
    if (proc) {
      setCurrentId(proc.id)
      setFormData({
        name: proc.name,
        tuss_code: proc.tuss_code,
        surgical_time_minutes: proc.surgical_time_minutes || 60,
        setup_time_minutes: proc.setup_time_minutes || 30,
        requires_robot: proc.requires_robot,
        requires_proctor: proc.requires_proctor,
      })
    } else {
      setCurrentId(null)
      setFormData({
        name: '',
        tuss_code: '',
        surgical_time_minutes: 60,
        setup_time_minutes: 30,
        requires_robot: true,
        requires_proctor: false,
      })
    }
    setIsOpen(true)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (currentId) {
        const { error } = await supabase.from('procedures').update(formData).eq('id', currentId)
        if (error) throw error
        toast.success('Procedimento atualizado')
      } else {
        const { error } = await supabase.from('procedures').insert([formData])
        if (error) throw error
        toast.success('Procedimento criado')
      }
      setIsOpen(false)
      fetchProcedimentos()
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = procedimentos.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.tuss_code.includes(search),
  )

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Procedimentos</h1>
          <p className="text-muted-foreground mt-2">
            Catálogo de procedimentos cirúrgicos e códigos TUSS.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar procedimento..."
              className="w-64 pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {canEdit && (
            <Button onClick={() => openForm()}>
              <Plus className="w-4 h-4 mr-2" /> Novo
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{currentId ? 'Editar Procedimento' : 'Novo Procedimento'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Procedimento</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Código TUSS</Label>
                <Input
                  required
                  value={formData.tuss_code}
                  onChange={(e) => setFormData({ ...formData, tuss_code: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tempo Cirúrgico (min)</Label>
                  <Input
                    type="number"
                    required
                    min={1}
                    value={formData.surgical_time_minutes}
                    onChange={(e) =>
                      setFormData({ ...formData, surgical_time_minutes: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tempo Setup (min)</Label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={formData.setup_time_minutes}
                    onChange={(e) =>
                      setFormData({ ...formData, setup_time_minutes: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <Label className="flex items-center gap-2 cursor-pointer font-normal">
                  <Input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={formData.requires_robot}
                    onChange={(e) => setFormData({ ...formData, requires_robot: e.target.checked })}
                  />
                  Requer Robô
                </Label>
                <Label className="flex items-center gap-2 cursor-pointer font-normal">
                  <Input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={formData.requires_proctor}
                    onChange={(e) =>
                      setFormData({ ...formData, requires_proctor: e.target.checked })
                    }
                  />
                  Requer Proctor
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TUSS</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tempo Estimado</TableHead>
              <TableHead>Requisitos</TableHead>
              {canEdit && <TableHead className="w-[100px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhum procedimento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((proc) => (
                <TableRow key={proc.id}>
                  <TableCell className="font-mono text-sm">{proc.tuss_code}</TableCell>
                  <TableCell className="font-medium">{proc.name}</TableCell>
                  <TableCell>
                    {proc.surgical_time_minutes}m cirurgia
                    <br />
                    <span className="text-xs text-muted-foreground">
                      +{proc.setup_time_minutes}m setup
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {proc.requires_robot && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                        >
                          Robô
                        </Badge>
                      )}
                      {proc.requires_proctor && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200"
                        >
                          Proctor
                        </Badge>
                      )}
                      {!proc.requires_robot && !proc.requires_proctor && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => openForm(proc)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(proc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
