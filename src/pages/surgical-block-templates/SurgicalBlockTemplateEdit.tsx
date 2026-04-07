import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SurgicalBlockTemplateForm } from '@/components/surgical-block-templates/SurgicalBlockTemplateForm'
import { Skeleton } from '@/components/ui/skeleton'

export default function SurgicalBlockTemplateEdit() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: tpl } = await supabase
        .from('surgical_block_templates' as any)
        .select('*')
        .eq('id', id)
        .single()
      if (tpl) setData(tpl)
      setLoading(false)
    }
    fetchData()
  }, [id])

  if (loading)
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/modelos-blocos">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Modelo</h1>
          <p className="text-muted-foreground mt-1">Atualize os dados do modelo de bloco.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Modelo</CardTitle>
          <CardDescription>Modifique os campos necessários.</CardDescription>
        </CardHeader>
        <CardContent>{data && <SurgicalBlockTemplateForm initialData={data} />}</CardContent>
      </Card>
    </div>
  )
}
