import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

interface HospitalSelectorProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function HospitalSelector({ value, onChange, disabled, className }: HospitalSelectorProps) {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadHospitals() {
      try {
        const { data } = await supabase.from('hospitals').select('id, name').order('name')

        if (data) {
          setHospitals(data)
        }
      } catch (error) {
        console.error('Error loading hospitals:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHospitals()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Carregando hospitais...</span>
      </div>
    )
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Selecione um hospital" />
      </SelectTrigger>
      <SelectContent>
        {hospitals.length === 0 ? (
          <div className="p-2 text-sm text-muted-foreground text-center">
            Nenhum hospital encontrado
          </div>
        ) : (
          hospitals.map((hospital) => (
            <SelectItem key={hospital.id} value={hospital.id}>
              {hospital.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  )
}
