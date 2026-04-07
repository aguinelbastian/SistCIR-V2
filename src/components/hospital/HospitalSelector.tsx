import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'

interface Props {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
  allowAll?: boolean
}

export function HospitalSelector({ value, onValueChange, disabled, allowAll }: Props) {
  const { user } = useAuth()
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('hospital_users')
        .select('hospitals(id, hospital_name)')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (data) {
        const validHospitals = data.map((hu: any) => hu.hospitals).filter(Boolean)

        setHospitals(validHospitals)

        if (validHospitals.length === 1 && !value && !allowAll) {
          onValueChange(validHospitals[0].id)
        }
      }
      setLoading(false)
    }

    fetchHospitals()
  }, [user])

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? 'Carregando...' : 'Selecione o hospital'} />
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all">Todos os Hospitais</SelectItem>}
        {hospitals.map((h) => (
          <SelectItem key={h.id} value={h.id}>
            {h.hospital_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
