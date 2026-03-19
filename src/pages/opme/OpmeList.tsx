import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function OpmeList() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    api.opme.list().then(({ data }) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Estoque OPME</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>TUSS</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{p.tuss_code}</TableCell>
                  <TableCell className="capitalize">{p.item_type.replace('_', ' ')}</TableCell>
                  <TableCell>
                    {p.is_available ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                        Disponível
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Indisponível</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
