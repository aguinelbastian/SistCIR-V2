import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface HospitalSelectorProps {
  value: string
  onValueChange: (value: string) => void
  allowAll?: boolean
  disabled?: boolean
}

export function HospitalSelector({
  value,
  onValueChange,
  allowAll = false,
  disabled = false,
}: HospitalSelectorProps) {
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHospitals() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('hospitals')
          .select('id, hospital_name')
          .order('hospital_name')

        if (error) throw error
        setHospitals(data || [])
      } catch (err) {
        console.error('Error fetching hospitals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHospitals()
  }, [])

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? 'Carregando...' : 'Selecione um hospital'} />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all">Todos os Hospitais</SelectItem>}
        {hospitals.map((hospital) => (
          <SelectItem key={hospital.id} value={hospital.id}>
            {hospital.hospital_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
