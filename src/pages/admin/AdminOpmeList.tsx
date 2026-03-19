import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/services/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Package, Pencil } from 'lucide-react'

export default function AdminOpmeList() {
  const { hasRole, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    manufacturer: '',
  })

  const [editingItem, setEditingItem] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    code: '',
    description: '',
    manufacturer: '',
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  useEffect(() => {
    if (!authLoading && !hasRole('admin') && !hasRole('opme')) {
      navigate('/dashboard')
    }
  }, [authLoading, hasRole, navigate])

  const loadData = async () => {
    const { data, error } = await api.opmeCatalog.list()
    if (data) setItems(data)
    if (error) toast.error('Erro ao carregar catálogo')
  }

  useEffect(() => {
    if (hasRole('admin') || hasRole('opme')) {
      loadData()
    }
  }, [hasRole])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      return toast.error('O código é obrigatório.')
    }
    if (formData.description.trim().length < 5) {
      return toast.error('A descrição deve ter pelo menos 5 caracteres.')
    }
    if (formData.manufacturer.trim().length < 3) {
      return toast.error('O fabricante deve ter pelo menos 3 caracteres.')
    }

    setLoading(true)
    const payload = {
      code: formData.code.trim(),
      description: formData.description.trim(),
      manufacturer: formData.manufacturer.trim(),
      name: formData.description.trim(),
      tuss_code: formData.code.trim(),
      item_type: 'outro',
    }

    const { error } = await api.opmeCatalog.create(payload)
    setLoading(false)

    if (error) {
      if (error.code === '23505') toast.error('Este código já está cadastrado no catálogo')
      else toast.error('Erro ao salvar material.')
      return
    }

    toast.success('Material cadastrado com sucesso')
    setFormData({ code: '', description: '', manufacturer: '' })
    loadData()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await api.opmeCatalog.update(id, { is_active: !currentStatus })
    if (error) {
      toast.error('Erro ao alterar status')
    } else {
      toast.success(!currentStatus ? 'Material ativado' : 'Material desativado')
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_active: !currentStatus } : item)),
      )
    }
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setEditForm({
      code: item.code || '',
      description: item.description || item.name || '',
      manufacturer: item.manufacturer || '',
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editForm.code.trim()) {
      return toast.error('O código é obrigatório.')
    }
    if (editForm.description.trim().length < 5) {
      return toast.error('A descrição deve ter pelo menos 5 caracteres.')
    }
    if (editForm.manufacturer.trim().length < 3) {
      return toast.error('O fabricante deve ter pelo menos 3 caracteres.')
    }

    setIsSavingEdit(true)
    const payload = {
      code: editForm.code.trim(),
      description: editForm.description.trim(),
      manufacturer: editForm.manufacturer.trim(),
      name: editForm.description.trim(),
      tuss_code: editForm.code.trim(),
    }

    const { error } = await api.opmeCatalog.update(editingItem.id, payload)
    setIsSavingEdit(false)

    if (error) {
      if (error.code === '23505') toast.error('Este código já está cadastrado no catálogo')
      else toast.error('Erro ao atualizar material.')
      return
    }

    toast.success('Material atualizado com sucesso')
    setEditingItem(null)
    loadData()
  }

  if (authLoading || (!hasRole('admin') && !hasRole('opme'))) return null

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Package className="w-8 h-8 text-primary" /> Catálogo OPME
        </h1>
        <p className="text-muted-foreground mt-1">Gerencie os materiais cirúrgicos disponíveis.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Material</CardTitle>
          <CardDescription>Adicione um novo item de OPME ao catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: ROB-006"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nome do material"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manu">Fabricante</Label>
              <Input
                id="manu"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                placeholder="Fabricante"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Salvando...' : 'Cadastrar Material'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Materiais Cadastrados</CardTitle>
          <CardDescription>
            Ative ou desative itens para disponibilizá-los nos pedidos.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fabricante</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground">{item.code}</TableCell>
                  <TableCell className="font-medium">{item.description || item.name}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">
                        Inativo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggle(item.id, item.is_active)}
                        aria-label="Alternar status do material"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(item)}
                        title="Editar Material"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum material encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={(o) => !o && setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Material OPME</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código</Label>
              <Input
                id="edit-code"
                value={editForm.code}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Descrição</Label>
              <Input
                id="edit-desc"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-manu">Fabricante</Label>
              <Input
                id="edit-manu"
                value={editForm.manufacturer}
                onChange={(e) => setEditForm({ ...editForm, manufacturer: e.target.value })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditingItem(null)}
                disabled={isSavingEdit}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSavingEdit}>
                {isSavingEdit ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
