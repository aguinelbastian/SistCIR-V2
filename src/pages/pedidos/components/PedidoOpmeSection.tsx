import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'

export function PedidoOpmeSection({ pedidoId }: { pedidoId: string }) {
  const { hasRole, user } = useAuth()
  const canEdit = hasRole('opme') || hasRole('admin')

  const [items, setItems] = useState<any[]>([])
  const [catalog, setCatalog] = useState<any[]>([])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editItemDisplay, setEditItemDisplay] = useState('')
  const [deleteId, setDeleteId] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [addForm, setAddForm] = useState({
    catalog_id: '',
    quantity: 1,
    authorization_code: '',
    authorized_at: '',
    notes: '',
  })

  const [editForm, setEditForm] = useState({
    id: '',
    quantity: 1,
    authorization_code: '',
    authorized_at: '',
    notes: '',
  })

  const loadData = async () => {
    const { data } = await supabase
      .from('pedido_opme_items')
      .select(`
        *,
        opme_catalog (
          id,
          name,
          item_type,
          description
        ),
        profiles ( name )
      `)
      .eq('pedido_id', pedidoId)
    if (data) setItems(data)
  }

  const loadCatalog = async () => {
    if (!canEdit) return
    const { data } = await supabase
      .from('opme_catalog')
      .select('*')
      .eq('is_active', true)
      .order('name')
    if (data) setCatalog(data)
  }

  useEffect(() => {
    loadData()
    loadCatalog()
  }, [pedidoId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      pedido_id: pedidoId,
      catalog_id: addForm.catalog_id,
      quantity: addForm.quantity,
      authorization_code: addForm.authorization_code || null,
      authorized_at:
        addForm.authorization_code && addForm.authorized_at ? addForm.authorized_at : null,
      notes: addForm.notes || null,
      added_by: user?.id,
    }

    const { error } = await supabase.from('pedido_opme_items').insert(payload)
    setLoading(false)

    if (error) {
      if (error.code === '23505') toast.error('Este material já está vinculado ao pedido')
      else toast.error('Erro ao adicionar material: ' + error.message)
    } else {
      toast.success('Material adicionado com sucesso')
      setAddForm({
        catalog_id: '',
        quantity: 1,
        authorization_code: '',
        authorized_at: '',
        notes: '',
      })
      loadData()
    }
  }

  const openEdit = (item: any) => {
    setEditItemDisplay(`[${item.opme_catalog?.item_type}] — ${item.opme_catalog?.name}`)
    setEditForm({
      id: item.id,
      quantity: item.quantity,
      authorization_code: item.authorization_code || '',
      authorized_at: item.authorized_at ? item.authorized_at.split('T')[0] : '',
      notes: item.notes || '',
    })
    setIsEditModalOpen(true)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      quantity: editForm.quantity,
      authorization_code: editForm.authorization_code || null,
      authorized_at:
        editForm.authorization_code && editForm.authorized_at ? editForm.authorized_at : null,
      notes: editForm.notes || null,
    }

    const { error } = await supabase.from('pedido_opme_items').update(payload).eq('id', editForm.id)
    setLoading(false)

    if (error) {
      toast.error('Erro ao atualizar material')
    } else {
      toast.success('Material atualizado com sucesso')
      setIsEditModalOpen(false)
      loadData()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    const { error } = await supabase.from('pedido_opme_items').delete().eq('id', deleteId.id)
    setLoading(false)
    if (error) {
      toast.error('Erro ao remover material')
    } else {
      toast.success('Material removido com sucesso')
      setDeleteId(null)
      loadData()
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Package className="w-5 h-5 text-muted-foreground" /> Catálogo OPME Solicitado
        </h2>
      </div>

      {canEdit && (
        <div className="bg-muted/30 border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Solicitar Material do Catálogo</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-2">
                <Label>Material *</Label>
                <Select
                  value={addForm.catalog_id}
                  onValueChange={(v) => setAddForm({ ...addForm, catalog_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o material" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalog.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        [{c.item_type}] — {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label>Quantidade *</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={addForm.quantity}
                  onChange={(e) =>
                    setAddForm({ ...addForm, quantity: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label>Código de autorização da operadora</Label>
                <Input
                  value={addForm.authorization_code}
                  onChange={(e) => setAddForm({ ...addForm, authorization_code: e.target.value })}
                  placeholder="Deixe em branco se ainda não autorizado"
                />
              </div>
              {addForm.authorization_code && (
                <div className="md:col-span-4 space-y-2">
                  <Label>Data de autorização</Label>
                  <Input
                    type="date"
                    required
                    value={addForm.authorized_at}
                    onChange={(e) => setAddForm({ ...addForm, authorized_at: e.target.value })}
                  />
                </div>
              )}
              <div
                className={
                  addForm.authorization_code
                    ? 'md:col-span-8 space-y-2'
                    : 'md:col-span-12 space-y-2'
                }
              >
                <Label>Observações</Label>
                <Textarea
                  maxLength={500}
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  placeholder="Opcional"
                  className="min-h-[40px] h-10"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!addForm.catalog_id || loading}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Material
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Tipo</TableHead>
              <TableHead>Nome do Item</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Autorização</TableHead>
              <TableHead>Autorizado em</TableHead>
              <TableHead>Solicitado por</TableHead>
              {canEdit && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-muted-foreground text-sm">
                  {item.opme_catalog?.item_type}
                </TableCell>
                <TableCell className="font-medium">{item.opme_catalog?.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {item.opme_catalog?.description || '—'}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {item.authorization_code ? (
                    <Badge className="bg-green-600 hover:bg-green-700">
                      {item.authorization_code}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100"
                    >
                      Pendente
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.authorized_at
                    ? new Date(item.authorized_at).toLocaleDateString('pt-BR')
                    : '—'}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.profiles?.name || 'Sistema'}
                </TableCell>
                {canEdit && (
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={canEdit ? 8 : 7}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhum material OPME solicitado para este pedido.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Material</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Material</Label>
              <Input value={editItemDisplay} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Quantidade *</Label>
              <Input
                type="number"
                min="1"
                required
                value={editForm.quantity}
                onChange={(e) =>
                  setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Código de autorização da operadora</Label>
              <Input
                value={editForm.authorization_code}
                onChange={(e) => setEditForm({ ...editForm, authorization_code: e.target.value })}
                placeholder="Deixe em branco se ainda não autorizado"
              />
            </div>
            {editForm.authorization_code && (
              <div className="space-y-2">
                <Label>Data de autorização</Label>
                <Input
                  type="date"
                  required
                  value={editForm.authorized_at}
                  onChange={(e) => setEditForm({ ...editForm, authorized_at: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                maxLength={500}
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Material</DialogTitle>
            <DialogDescription>
              Remover <strong>{deleteId?.opme_catalog?.name}</strong> deste pedido?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
