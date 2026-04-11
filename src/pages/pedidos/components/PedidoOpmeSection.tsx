import React, { useEffect, useState } from 'react'
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
  const canAllocate = hasRole('opme') || hasRole('nursing') || hasRole('admin')

  const [items, setItems] = useState<any[]>([])
  const [consumptions, setConsumptions] = useState<any[]>([])
  const [catalog, setCatalog] = useState<any[]>([])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editItemDisplay, setEditItemDisplay] = useState('')
  const [deleteId, setDeleteId] = useState<any>(null)

  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false)
  const [allocatingItem, setAllocatingItem] = useState<any>(null)
  const [physicalItems, setPhysicalItems] = useState<any[]>([])

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

  const [allocateForm, setAllocateForm] = useState({
    opme_item_id: '',
    quantity: 1,
  })

  const loadData = async () => {
    const [reqRes, consRes] = await Promise.all([
      supabase
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
        .eq('pedido_id', pedidoId),
      supabase
        .from('pedido_opme_consumo')
        .select(`
          *,
          opme_items (
            id,
            name,
            catalog_id,
            lot_number,
            current_lives
          )
        `)
        .eq('pedido_id', pedidoId),
    ])

    if (reqRes.data) setItems(reqRes.data)
    if (consRes.data) setConsumptions(consRes.data)
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

  const openAllocateModal = async (item: any) => {
    setAllocatingItem(item)

    const itemConsumptions = consumptions.filter(
      (c) => c.opme_items?.catalog_id === item.catalog_id,
    )
    const totalAllocated = itemConsumptions.reduce((acc, c) => acc + (c.quantity || 0), 0)
    const remaining = Math.max(1, item.quantity - totalAllocated)

    setAllocateForm({ opme_item_id: '', quantity: remaining })

    const { data } = await supabase
      .from('opme_items')
      .select('*')
      .eq('catalog_id', item.catalog_id)
      .eq('is_active', true)

    const availableItems = (data || []).filter(
      (i) => i.current_lives === null || i.current_lives > 0,
    )

    setPhysicalItems(availableItems)
    setIsAllocateModalOpen(true)
  }

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      pedido_id: pedidoId,
      opme_item_id: allocateForm.opme_item_id,
      quantity: allocateForm.quantity,
      registered_by: user?.id,
    }

    const { error } = await supabase.from('pedido_opme_consumo').insert(payload)
    setLoading(false)

    if (error) {
      toast.error('Erro ao alocar item: ' + error.message)
    } else {
      toast.success('Item alocado com sucesso')
      setIsAllocateModalOpen(false)
      loadData()
    }
  }

  const handleRemoveAllocation = async (consumoId: string) => {
    setLoading(true)
    const { error } = await supabase.from('pedido_opme_consumo').delete().eq('id', consumoId)
    setLoading(false)
    if (error) {
      toast.error('Erro ao remover alocação')
    } else {
      toast.success('Alocação removida')
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
                <Label>Código de autorização</Label>
                <Input
                  value={addForm.authorization_code}
                  onChange={(e) => setAddForm({ ...addForm, authorization_code: e.target.value })}
                  placeholder="Deixe em branco se não autorizado"
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
              <TableHead>Qtd</TableHead>
              <TableHead>Status Alocação</TableHead>
              <TableHead>Autorização</TableHead>
              <TableHead>Solicitado por</TableHead>
              {(canEdit || canAllocate) && <TableHead className="text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.flatMap((item) => {
              const itemConsumptions = consumptions.filter(
                (c) => c.opme_items?.catalog_id === item.catalog_id,
              )
              const totalAllocated = itemConsumptions.reduce((acc, c) => acc + (c.quantity || 0), 0)
              const isFullyAllocated = totalAllocated >= item.quantity

              const rows = [
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground text-sm">
                    {item.opme_catalog?.item_type}
                  </TableCell>
                  <TableCell className="font-medium">{item.opme_catalog?.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {isFullyAllocated ? (
                      <Badge className="bg-green-600 hover:bg-green-700">✅ Alocado</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200"
                      >
                        ⚠️ Pendente ({totalAllocated}/{item.quantity})
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.authorization_code ? (
                      <Badge variant="outline" className="bg-muted">
                        {item.authorization_code}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.profiles?.name || 'Sistema'}
                  </TableCell>
                  {(canEdit || canAllocate) && (
                    <TableCell className="text-right space-x-2">
                      {canAllocate && !isFullyAllocated && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openAllocateModal(item)}
                          className="h-8"
                        >
                          Alocar Pinça
                        </Button>
                      )}
                      {canEdit && (
                        <span className="inline-flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                            <Edit2 className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteId(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </span>
                      )}
                    </TableCell>
                  )}
                </TableRow>,
              ]

              if (itemConsumptions.length > 0) {
                rows.push(
                  <TableRow
                    key={`${item.id}-consumptions`}
                    className="bg-muted/10 hover:bg-muted/10"
                  >
                    <TableCell colSpan={canEdit || canAllocate ? 7 : 6} className="p-0 border-b">
                      <div className="px-6 py-3 space-y-2 border-l-2 border-primary/50 ml-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Itens Físicos Alocados:
                        </p>
                        <div className="space-y-1.5">
                          {itemConsumptions.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-center justify-between text-sm bg-background border px-3 py-2 rounded-md shadow-sm"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <span className="font-medium">{c.opme_items?.name}</span>
                                <div className="flex gap-3 text-muted-foreground">
                                  {c.opme_items?.lot_number && (
                                    <span>Lote: {c.opme_items.lot_number}</span>
                                  )}
                                  {c.opme_items?.current_lives !== null && (
                                    <span>Vidas: {c.opme_items.current_lives}</span>
                                  )}
                                  <span className="font-semibold text-foreground">
                                    Qtd: {c.quantity}
                                  </span>
                                </div>
                              </div>
                              {canAllocate && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveAllocation(c.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>,
                )
              }

              return rows
            })}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={canEdit || canAllocate ? 7 : 6}
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
              <Label>Código de autorização</Label>
              <Input
                value={editForm.authorization_code}
                onChange={(e) => setEditForm({ ...editForm, authorization_code: e.target.value })}
                placeholder="Deixe em branco se ainda não autorizado"
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

      <Dialog open={isAllocateModalOpen} onOpenChange={setIsAllocateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alocar Pinça Física</DialogTitle>
            <DialogDescription>
              Selecione o item físico do inventário que será utilizado nesta cirurgia.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAllocate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Item Solicitado</Label>
              <Input
                value={allocatingItem?.opme_catalog?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Item Físico Disponível *</Label>
              <Select
                value={allocateForm.opme_item_id}
                onValueChange={(v) => setAllocateForm({ ...allocateForm, opme_item_id: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o item do inventário..." />
                </SelectTrigger>
                <SelectContent>
                  {physicalItems.map((pi) => (
                    <SelectItem key={pi.id} value={pi.id}>
                      {pi.name} {pi.lot_number ? `(Lote: ${pi.lot_number})` : ''}{' '}
                      {pi.current_lives !== null ? `- Vidas: ${pi.current_lives}` : ''}
                    </SelectItem>
                  ))}
                  {physicalItems.length === 0 && (
                    <SelectItem value="none" disabled>
                      Nenhum item com estoque disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade a Alocar *</Label>
              <Input
                type="number"
                min="1"
                required
                value={allocateForm.quantity}
                onChange={(e) =>
                  setAllocateForm({ ...allocateForm, quantity: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAllocateModalOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  loading || !allocateForm.opme_item_id || allocateForm.opme_item_id === 'none'
                }
              >
                {loading ? 'Alocando...' : 'Confirmar Alocação'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
