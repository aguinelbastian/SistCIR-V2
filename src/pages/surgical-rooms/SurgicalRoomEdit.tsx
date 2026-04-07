import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { SurgicalRoomForm } from './SurgicalRoomForm'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'

export default function SurgicalRoomEdit() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return
      const { data, error } = await supabase
        .from('surgical_rooms')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        toast({ title: 'Erro', description: 'Sala não encontrada', variant: 'destructive' })
      } else {
        setData(data)
      }
      setLoading(false)
    }
    fetchRoom()
  }, [id])

  if (loading) return <Skeleton className="w-full h-96" />
  if (!data) return <div>Sala não encontrada</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SurgicalRoomForm initialData={data} roomId={id} />
    </div>
  )
}
