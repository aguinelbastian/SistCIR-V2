import { useEffect, useState } from 'react'
import { api } from '@/services/api'
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
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'

export function PedidoOpmeSection({ pedidoId }: { pedidoId: string }) {
  const { hasRole, user } = useAuth()
  const canEdit = hasRole('opme') || hasRole('admin')

  const [items, setItems] = useState<any[]>([])
  const [catalog, setCatalog] = useState<any[]>([])
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [deleteId, setDeleteId] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    id: '',
    opme_item_id: '',
    quantity: 1,
    authorization_code: '',
    authorized_at: '',
    notes: '',
  })

  const loadData = async () => {
    const { data } = await api.pedidoOpme.list(pedidoId)
    if (data) setItems(data)
  }

  const loadCatalog = async () => {
    if (!canEdit) return
    const { data } = await api.opmeCatalog.listActive()
    if (data) setCatalog(data)
  }

  useEffect(() => {
    loadData()
    loadCatalog()
  }, [pedidoId])

  const openAdd = () => {
    setForm({
      id: '',
      opme_item_id: '',
      quantity: 1,
      authorization_code: '',
      authorized_at: '',
      notes: '',
    })
    setModalMode('add')
  }

  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      opme_item_id: item.opme_item_id,
      quantity: item.quantity,
      authorization_code: item.authorization_code || '',
      authorized_at: item.authorized_at ? item.authorized_at.split('T')[0] : '',
      notes: item.notes || '',
    })
    setModalMode('edit')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      pedido_id: pedidoId,
      opme_item_id: form.opme_item_id,
      quantity: form.quantity,
      authorization_code: form.authorization_code || null,
      authorized_at: form.authorization_code && form.authorized_at ? form.authorized_at : null,
      notes: form.notes || null,
      added_by: user?.id,
    }

    let error
    if (modalMode === 'add') {
      const res = await api.pedidoOpme.add(payload)
      error = res.error
    } else {
      const res = await api.pedidoOpme.update(form.id, payload)
      error = res.error
    }

    setLoading(false)
    if (error) {
      if (error.code === '23505') toast.error('Este material já está vinculado ao pedido')
      else toast.error('Erro ao salvar material')
    } else {
      toast.success(
        modalMode === 'add' ? 'Material adicionado com sucesso' : 'Material atualizado com sucesso',
      )
      setModalMode(null)
      loadData()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await api.pedidoOpme.remove(deleteId.id)
    if (error) {
      toast.error('Erro ao remover material')
    } else {
      toast.success('Material removido com sucesso')
      setDeleteId(null)
      loadData()
    }
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Package className="w-5 h-5 text-muted-foreground" /> Materiais OPME
        </h2>
        {canEdit && (
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" /> Adicionar Material
          </Button>
        )}
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Autorização</TableHead>
              <TableHead>Autorizado em</TableHead>
              <TableHead>Adicionado por</TableHead>
              {canEdit && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-muted-foreground">
                  {item.opme_items?.code}
                </TableCell>
                <TableCell className="font-medium">
                  {item.opme_items?.description}
                  <div className="text-xs text-muted-foreground">
                    {item.opme_items?.manufacturer}
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {item.authorization_code ? (
                    <span className="font-mono bg-muted px-2 py-1 rounded">
                      {item.authorization_code}
                    </span>
                  ) : (
                    <span className="text-muted-foreground italic">Pendente</span>
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
                      className="text-red-600 hover:text-red-700"
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
                  colSpan={canEdit ? 7 : 6}
                  className="text-center py-6 text-muted-foreground"
                >
                  Nenhum material OPME vinculado a este pedido.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!modalMode} onOpenChange={(o) => !o && setModalMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalMode === 'add' ? 'Vincular Material' : 'Editar Material'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Material</Label>
              <Select
                value={form.opme_item_id}
                onValueChange={(v) => setForm({ ...form, opme_item_id: v })}
                disabled={modalMode === 'edit'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o material" />
                </SelectTrigger>
                <SelectContent>
                  {catalog.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      [{c.code}] — {c.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                required
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cód. Autorização</Label>
                <Input
                  value={form.authorization_code}
                  onChange={(e) => setForm({ ...form, authorization_code: e.target.value })}
                  placeholder="Opcional"
                />
              </div>
              {form.authorization_code && (
                <div className="space-y-2">
                  <Label>Data Autorização</Label>
                  <Input
                    type="date"
                    required
                    value={form.authorized_at}
                    onChange={(e) => setForm({ ...form, authorized_at: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                maxLength={500}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Observações sobre o material..."
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setModalMode(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.opme_item_id || loading}>
                Salvar
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
              Remover <strong>{deleteId?.opme_items?.description}</strong> deste pedido?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
