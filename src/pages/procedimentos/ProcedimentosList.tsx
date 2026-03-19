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

export default function ProcedimentosList() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    api.procedimentos.list().then(({ data }) => {
      if (data) setItems(data)
    })
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Procedimentos</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>TUSS</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tempo (min)</TableHead>
                <TableHead>Robô</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-muted-foreground">{p.tuss_code}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.surgical_time_minutes}m</TableCell>
                  <TableCell>
                    {p.requires_robot ? <Badge>Sim</Badge> : <Badge variant="secondary">Não</Badge>}
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
