import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SurgicalBlockExceptionForm } from '@/components/surgical-block-exceptions/SurgicalBlockExceptionForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function SurgicalBlockExceptionEdit() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: exc } = await supabase
        .from('surgical_block_exceptions' as any)
        .select('*')
        .eq('id', id)
        .single()
      if (exc) setData(exc)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading)
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[250px] w-full" />
      </div>
    )

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/excecoes-blocos">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Exceção</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados desta exceção.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Exceção</CardTitle>
          <CardDescription>Modifique a data ou o motivo conforme necessário.</CardDescription>
        </CardHeader>
        <CardContent>{data && <SurgicalBlockExceptionForm initialData={data} />}</CardContent>
      </Card>
    </div>
  )
}
