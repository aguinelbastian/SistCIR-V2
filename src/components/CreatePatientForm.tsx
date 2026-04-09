import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  full_name: z.string().min(3, 'Mínimo 3 caracteres'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 números'),
  medical_record: z.string().min(3, 'Mínimo 3 caracteres'),
  date_of_birth: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_plan: z.string().optional(),
  insurance_card_number: z.string().optional(),
  profissao: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10,11}$/.test(v), 'Formato inválido (10-11 dígitos)'),
  pessoa_contato: z.string().optional(),
  telefone_contato: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10,11}$/.test(v), 'Formato inválido (10-11 dígitos)'),
  cns: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

async function hashCpf(cpf: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(cpf.replace(/\D/g, ''))
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function CreatePatientForm({
  onSuccess,
  onCancel,
}: {
  onSuccess?: (id: string) => void
  onCancel?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      cpf: '',
      medical_record: '',
      date_of_birth: '',
      insurance_provider: '',
      insurance_plan: '',
      insurance_card_number: '',
      profissao: '',
      endereco: '',
      telefone: '',
      pessoa_contato: '',
      telefone_contato: '',
      cns: '',
    },
  })

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true)
    try {
      const hashedCpf = await hashCpf(values.cpf)
      const { data: existing } = await supabase
        .from('patients')
        .select('id')
        .eq('cpf_hash', hashedCpf)
        .maybeSingle()
      if (existing) {
        toast.error('CPF já cadastrado')
        return
      }

      const { data: userAuth } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('patients')
        .insert({
          full_name: values.full_name,
          cpf_hash: hashedCpf,
          medical_record: values.medical_record,
          date_of_birth: values.date_of_birth || null,
          insurance_provider: values.insurance_provider || null,
          insurance_plan: values.insurance_plan || null,
          insurance_card_number: values.insurance_card_number || null,
          profissao: values.profissao || null,
          endereco: values.endereco || null,
          telefone: values.telefone || null,
          pessoa_contato: values.pessoa_contato || null,
          telefone_contato: values.telefone_contato || null,
          cns: values.cns || null,
          created_by: userAuth?.user?.id,
        })
        .select('id')
        .single()

      if (error) throw error
      toast.success('Paciente criado com sucesso')
      form.reset()
      onSuccess?.(data.id)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar paciente')
    } finally {
      setIsSubmitting(false)
    }
  }

  const InputField = ({
    name,
    label,
    type = 'text',
    placeholder = '',
  }: {
    name: keyof FormData
    label: string
    type?: string
    placeholder?: string
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  const Section = ({ title }: { title: string }) => (
    <div className="md:col-span-2 mt-2">
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
    </div>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="Dados Pessoais" />
          <InputField name="full_name" label="Nome Completo *" />
          <InputField name="cpf" label="CPF (Somente números) *" />
          <InputField name="medical_record" label="Prontuário *" />
          <InputField name="date_of_birth" label="Data de Nascimento" type="date" />

          <Section title="Contato" />
          <InputField name="telefone" label="Telefone (Somente números)" />
          <InputField name="pessoa_contato" label="Pessoa de Contato" />
          <InputField name="telefone_contato" label="Telefone de Contato" />

          <Section title="Profissão e Endereço" />
          <InputField name="profissao" label="Profissão" />
          <InputField name="endereco" label="Endereço" />

          <Section title="Convênio" />
          <InputField name="insurance_provider" label="Operadora" />
          <InputField name="insurance_plan" label="Plano" />
          <InputField name="insurance_card_number" label="Carteirinha" />
          <InputField name="cns" label="CNS" />
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Criar Paciente
          </Button>
        </div>
      </form>
    </Form>
  )
}
