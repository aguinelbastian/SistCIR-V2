import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { UserCircle, Mail, Key, Check } from 'lucide-react'

export default function MinhaConta() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Profile Form
  const [name, setName] = useState('')
  const [crm, setCrm] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Email Form
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [isSavingEmail, setIsSavingEmail] = useState(false)

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('name, crm')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setName(data.name || '')
            setCrm(data.crm || '')
          }
        })
    }
  }, [user])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 3) {
      return toast.error('O nome deve ter pelo menos 3 caracteres.')
    }

    setIsSavingProfile(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim(), crm: crm.trim() })
      .eq('id', user!.id)
    setIsSavingProfile(false)

    if (error) {
      toast.error('Erro ao atualizar dados', { description: error.message })
    } else {
      toast.success('Dados atualizados com sucesso')
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newEmail !== confirmEmail) {
      return toast.error('Os e-mails não coincidem.')
    }

    setIsSavingEmail(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setIsSavingEmail(false)

    if (error) {
      toast.error('Erro ao atualizar e-mail', { description: error.message })
    } else {
      toast.success('Confirme o novo e-mail pela mensagem enviada')
      setNewEmail('')
      setConfirmEmail('')
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      return toast.error('A senha atual é obrigatória.')
    }
    if (newPassword.length < 8) {
      return toast.error('A nova senha deve ter pelo menos 8 caracteres.')
    }
    if (newPassword !== confirmPassword) {
      return toast.error('As novas senhas não coincidem.')
    }

    setIsSavingPassword(true)

    // Validate current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user!.email!,
      password: currentPassword,
    })

    if (signInError) {
      setIsSavingPassword(false)
      return toast.error('Senha atual incorreta.')
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setIsSavingPassword(false)

    if (error) {
      toast.error('Erro ao atualizar senha', { description: error.message })
    } else {
      toast.success('Senha alterada com sucesso')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }
  }

  const passwordStrength = () => {
    let score = 0
    if (!newPassword) return 0
    if (newPassword.length >= 8) score += 25
    if (newPassword.length >= 12) score += 25
    if (/[A-Z]/.test(newPassword)) score += 20
    if (/[0-9]/.test(newPassword)) score += 15
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 15
    return Math.min(100, score)
  }

  const strength = passwordStrength()
  let strengthColor = 'bg-red-500'
  if (strength >= 50) strengthColor = 'bg-yellow-500'
  if (strength >= 75) strengthColor = 'bg-emerald-500'

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais, e-mail e senha de acesso.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" /> Dados Cadastrais
            </CardTitle>
            <CardDescription>Atualize suas informações pessoais e profissionais.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crm">CRM</Label>
                  <Input id="crm" value={crm} onChange={(e) => setCrm(e.target.value)} />
                </div>
              </div>
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Alterar E-mail
            </CardTitle>
            <CardDescription>
              Seu e-mail atual é <strong>{user?.email}</strong>. Para alterá-lo, informe o novo
              endereço abaixo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new_email">Novo E-mail</Label>
                  <Input
                    id="new_email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_email">Confirmar Novo E-mail</Label>
                  <Input
                    id="confirm_email"
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSavingEmail || !newEmail || newEmail !== confirmEmail}
              >
                {isSavingEmail ? 'Enviando...' : 'Alterar E-mail'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-primary" /> Alterar Senha
            </CardTitle>
            <CardDescription>Crie uma senha forte para manter sua conta segura.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2 md:w-1/2">
                <Label htmlFor="current_password">Senha Atual</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nova Senha</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  {newPassword.length > 0 && (
                    <div className="space-y-1 mt-2">
                      <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                        <span>Força da senha</span>
                        <span>
                          {strength >= 75 ? 'Forte' : strength >= 50 ? 'Razoável' : 'Fraca'}
                        </span>
                      </div>
                      <Progress
                        value={strength}
                        className="h-1.5"
                        indicatorClassName={strengthColor}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  {newPassword && confirmPassword && newPassword === confirmPassword && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" /> As senhas coincidem
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={
                  isSavingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 8
                }
              >
                {isSavingPassword ? 'Salvando...' : 'Alterar Senha'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
