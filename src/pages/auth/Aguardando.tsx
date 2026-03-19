import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function Aguardando() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full text-center shadow-elevation border-none">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Aguardando Aprovação</CardTitle>
          <CardDescription className="text-base mt-2">
            Sua conta foi criada, mas ainda não foi ativada pelo administrador do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-8 bg-muted p-4 rounded-md">
            Por favor, aguarde enquanto validamos suas informações. Você receberá um aviso assim que
            seu acesso for liberado para agendar cirurgias.
          </p>
          <Button variant="outline" className="w-full" onClick={() => signOut()}>
            Sair e Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
