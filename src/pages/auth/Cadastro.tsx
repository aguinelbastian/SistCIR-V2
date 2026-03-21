import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Stethoscope } from 'lucide-react'
import { toast } from 'sonner'

export default function Cadastro() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    crm: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.name.trim().length < 3) {
      return toast.error('O nome deve ter pelo menos 3 caracteres.')
    }

    if (formData.password.length < 8) {
      return toast.error('A senha deve ter pelo menos 8 caracteres.')
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error('As senhas não coincidem')
    }

    setIsLoading(true)
    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.name,
      crm: formData.crm,
      user_role: 'surgeon',
    })
    setIsLoading(false)

    if (error) {
      const errorCode = (error as any).code || ''
      const errorStatus = (error as any).status || 0

      if (errorCode === 'email_address_invalid' || error.message?.includes('invalid')) {
        toast.error('O domínio deste e-mail não é aceito ou o formato é inválido.')
      } else if (errorCode === 'over_email_send_rate_limit' || errorStatus === 429) {
        toast.error(
          'Limite de tentativas excedido. Por favor, aguarde alguns minutos antes de tentar novamente.',
        )
      } else if (
        error.message?.toLowerCase().includes('already registered') ||
        errorStatus === 400
      ) {
        toast.error('Este e-mail já possui cadastro no sistema.')
      } else {
        toast.error('Erro ao processar cadastro. Tente novamente.', { description: error.message })
      }
    } else {
      toast.success('Cadastro solicitado com sucesso')
      navigate('/aguardando-aprovacao')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-elevation border-none animate-fade-in">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 text-primary-foreground shadow-sm">
            <Stethoscope className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Solicitar Acesso</CardTitle>
          <CardDescription>Preencha os dados abaixo para se cadastrar no SistCIR</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Dr. João Silva"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@exemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crm">CRM</Label>
              <Input
                id="crm"
                placeholder="12345-UF"
                value={formData.crm}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button className="w-full mt-2" type="submit" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Solicitar Cadastro'}
            </Button>

            <div className="text-center mt-4 text-sm">
              <span className="text-muted-foreground">Já possui uma conta? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
