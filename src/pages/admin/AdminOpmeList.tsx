import { useEffect, useState } from 'react'
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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Package, Plus } from 'lucide-react'

export default function AdminOpmeList() {
  const [items, setItems] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    manufacturer: '',
    name: 'OPME Item',
    tuss_code: '',
    item_type: 'outro',
  })

  const loadData = async () => {
    const { data, error } = await api.opmeCatalog.list()
    if (data) setItems(data)
    if (error) toast.error('Erro ao carregar catálogo')
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { ...formData, name: formData.description, tuss_code: formData.code }
    const { error } = await api.opmeCatalog.create(payload)
    setLoading(false)

    if (error) {
      if (error.code === '23505') toast.error('Este código já existe.')
      else toast.error('Erro ao salvar material.')
      return
    }

    toast.success('Material cadastrado com sucesso')
    setOpen(false)
    setFormData({ ...formData, code: '', description: '', manufacturer: '' })
    loadData()
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const { error } = await api.opmeCatalog.update(id, { is_active: !currentStatus })
    if (error) {
      toast.error('Erro ao alterar status')
    } else {
      toast.success(currentStatus ? 'Material desativado' : 'Material ativado')
      loadData()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-8 h-8 text-primary" /> Catálogo OPME
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os materiais cirúrgicos disponíveis.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Material OPME</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código (Único)</Label>
                <Input
                  id="code"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: ROB-006"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Descrição</Label>
                <Input
                  id="desc"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nome e especificações do material"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manu">Fabricante</Label>
                <Input
                  id="manu"
                  required
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Nome do fabricante"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-muted-foreground">{item.code}</TableCell>
                  <TableCell className="font-medium">{item.description || item.name}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
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
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={() => handleToggle(item.id, item.is_active)}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum material encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
