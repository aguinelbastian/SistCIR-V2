import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { CreatePatientForm } from '@/components/CreatePatientForm'

export default function PacientesList() {
  const [pacientes, setPacientes] = useState<any[]>([])
  const [open, setOpen] = useState(false)

  const load = async () => {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPacientes(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Paciente</DialogTitle>
            </DialogHeader>
            <CreatePatientForm
              onSuccess={() => {
                setOpen(false)
                load()
              }}
              onCancel={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Prontuário</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Convênio</TableHead>
                <TableHead>CPF (Hash)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pacientes.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.full_name}</TableCell>
                  <TableCell>{p.medical_record}</TableCell>
                  <TableCell>{p.telefone || '-'}</TableCell>
                  <TableCell>{p.insurance_provider || '-'}</TableCell>
                  <TableCell>
                    <span
                      className="text-xs text-muted-foreground truncate max-w-[100px] inline-block"
                      title={p.cpf_hash}
                    >
                      {p.cpf_hash?.substring(0, 8)}...
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {pacientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhum paciente cadastrado.
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
