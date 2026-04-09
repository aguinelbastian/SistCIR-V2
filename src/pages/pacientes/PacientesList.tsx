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
import { Plus, Edit2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { CreatePatientModal } from '@/components/pacientes/CreatePatientModal'
import { EditPatientModal } from '@/components/pacientes/EditPatientModal'

export default function PacientesList() {
  const { user } = useAuth()
  const [pacientes, setPacientes] = useState<any[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [editingPatient, setEditingPatient] = useState<any | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle()
      if (!error && data) {
        setUserRole(data.role)
      }
    }
    fetchUserRole()
  }, [user?.id])

  const canEdit = userRole === 'admin' || userRole === 'secretary'

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Novo Paciente
        </Button>
      </div>

      <CreatePatientModal
        open={openCreate}
        onOpenChange={setOpenCreate}
        onPatientCreated={() => {
          setOpenCreate(false)
          load()
        }}
      />

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
                {canEdit && <TableHead className="w-[80px] text-right">Ações</TableHead>}
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
                  {canEdit && (
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPatient(p)}
                        title="Editar Paciente"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {pacientes.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={canEdit ? 6 : 5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum paciente cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditPatientModal
        open={!!editingPatient}
        onOpenChange={(open: boolean) => !open && setEditingPatient(null)}
        patient={editingPatient}
        onPatientUpdated={() => {
          setEditingPatient(null)
          load()
        }}
      />
    </div>
  )
}
