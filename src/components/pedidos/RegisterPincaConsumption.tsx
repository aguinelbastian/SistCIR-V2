import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus } from 'lucide-react'

export function RegisterPincaConsumption({ pedidoId }: { pedidoId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [selectedItemId, setSelectedItemId] = useState('')
  const [livesConsumed, setLivesConsumed] = useState<number>(1)
  const [lotUsed, setLotUsed] = useState('')

  const carregarItens = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pedido_opme_items')
      .select(`
        id,
        quantity,
        lives_consumed,
        opme_items (
          id,
          name,
          item_type,
          current_lives
        )
      `)
      .eq('pedido_id', pedidoId)

    if (error) {
      toast.error('Erro ao carregar itens OPME: ' + error.message)
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    carregarItens()
  }, [pedidoId])

  const handleRegister = async () => {
    if (!selectedItemId) {
      toast.error('Selecione uma pinça')
      return
    }

    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return

    if (livesConsumed <= 0) {
      toast.error('A quantidade de vidas consumidas deve ser maior que zero')
      return
    }

    if (item.quantity < (item.lives_consumed || 0) + livesConsumed) {
      toast.error('A quantidade consumida excederá a quantidade solicitada para esta cirurgia')
      return
    }

    setSubmitting(true)
    try {
      const { data, error } = await supabase.rpc('register_pinça_consumption', {
        p_pedido_opme_item_id: selectedItemId,
        p_lives_consumed: (item.lives_consumed || 0) + livesConsumed,
        p_lot_used: lotUsed || null,
      })

      if (error) throw error

      if (data && data.length > 0 && !data[0].success) {
        toast.error(data[0].message)
      } else {
        toast.success(data[0]?.message || 'Consumo registrado com sucesso!')
        setSelectedItemId('')
        setLivesConsumed(1)
        setLotUsed('')
        await carregarItens()
      }
    } catch (err: any) {
      toast.error('Erro ao registrar consumo: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  const pincas = items.filter((i) => i.opme_items?.item_type === 'pinça_clicada')

  if (pincas.length === 0) {
    return (
      <Card className="border-dashed bg-muted/30 mt-6">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          Nenhuma pinça robótica (com vidas) foi solicitada para este pedido.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 shadow-sm mt-6">
      <CardHeader className="bg-muted/30 border-b pb-4">
        <CardTitle className="text-lg">Registro de Consumo de Pinças</CardTitle>
        <CardDescription>
          Registre as vidas consumidas de cada pinça durante a execução da cirurgia.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Pinça Utilizada</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {pincas.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.opme_items.name} (Sol: {item.quantity} | Usadas:{' '}
                    {item.lives_consumed || 0})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Vidas Consumidas Agora</Label>
            <Input
              type="number"
              min={1}
              value={livesConsumed}
              onChange={(e) => setLivesConsumed(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label>Lote Utilizado (Opcional)</Label>
            <Input
              placeholder="Ex: LOTE-123"
              value={lotUsed}
              onChange={(e) => setLotUsed(e.target.value)}
            />
          </div>
        </div>

        <Button
          onClick={handleRegister}
          disabled={submitting || !selectedItemId}
          className="w-full sm:w-auto"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Registrar Consumo
        </Button>

        <div className="mt-6 border rounded-md divide-y">
          <div className="bg-muted/50 p-3 text-sm font-medium grid grid-cols-12 gap-2">
            <div className="col-span-6">Pinça</div>
            <div className="col-span-2 text-center">Solicitado</div>
            <div className="col-span-2 text-center">Consumido</div>
            <div className="col-span-2 text-center">Lote</div>
          </div>
          {pincas.map((item) => (
            <div key={item.id} className="p-3 text-sm grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6 truncate" title={item.opme_items.name}>
                {item.opme_items.name}
              </div>
              <div className="col-span-2 text-center font-medium">{item.quantity}</div>
              <div className="col-span-2 text-center font-medium text-primary">
                {item.lives_consumed || 0}
              </div>
              <div className="col-span-2 text-center text-muted-foreground truncate">
                {item.lot_used || '-'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
