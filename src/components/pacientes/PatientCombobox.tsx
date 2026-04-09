import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { supabase } from '@/lib/supabase/client'
import { CreatePatientModal } from './CreatePatientModal'

export function PatientCombobox({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  useEffect(() => {
    if (value && !selectedPatient) {
      supabase
        .from('patients')
        .select('id, full_name, medical_record')
        .eq('id', value)
        .single()
        .then(({ data }) => {
          if (data) setSelectedPatient(data)
        })
    }
  }, [value, selectedPatient])

  useEffect(() => {
    const timer = setTimeout(() => {
      async function searchPatients() {
        setLoading(true)
        let q = supabase
          .from('patients')
          .select('id, full_name, medical_record')
          .order('full_name')
          .limit(20)

        if (search) {
          q = q.or(`full_name.ilike.%${search}%,medical_record.ilike.%${search}%`)
        }

        const { data } = await q
        setPatients(data || [])
        setLoading(false)
      }
      searchPatients()
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn('w-full justify-between font-normal', !value && 'text-muted-foreground')}
          >
            <span className="truncate">
              {value && selectedPatient
                ? `${selectedPatient.full_name} (${selectedPatient.medical_record})`
                : 'Buscar paciente por nome ou prontuário...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar paciente por nome ou prontuário..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                {loading ? (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-muted-foreground">Nenhum paciente encontrado.</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOpen(false)
                        setModalOpen(true)
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Novo Paciente
                    </Button>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {patients.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.id}
                    onSelect={() => {
                      setSelectedPatient(p)
                      onChange(p.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn('mr-2 h-4 w-4', p.id === value ? 'opacity-100' : 'opacity-0')}
                    />
                    {p.full_name} ({p.medical_record})
                  </CommandItem>
                ))}
              </CommandGroup>
              {patients.length > 0 && (
                <div className="p-2 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setOpen(false)
                      setModalOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Novo Paciente
                  </Button>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreatePatientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onPatientCreated={(patient) => {
          setSelectedPatient(patient)
          onChange(patient.id)
          setModalOpen(false)
          setSearch('')
        }}
      />
    </>
  )
}
