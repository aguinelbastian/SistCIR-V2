import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function Aguardando() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-md w-full text-center shadow-elevation border-none animate-fade-in">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Cadastro recebido com sucesso!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Seu acesso está sendo analisado pelo administrador do sistema. Você receberá um e-mail
            assim que sua conta for liberada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full mt-4" onClick={() => signOut()}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
