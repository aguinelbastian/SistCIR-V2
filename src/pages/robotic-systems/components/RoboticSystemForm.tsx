import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { getFacilities } from '@/services/robotic-systems'
import { useAuth } from '@/hooks/use-auth'
import { RoboticSystem } from '@/types/sistcir'

const formSchema = z.object({
  system_name: z.string().min(1, 'Nome do sistema é obrigatório'),
  model: z.enum(['da Vinci Xi', 'da Vinci X', 'da Vinci SP']),
  serial_number: z.string().optional().nullable(),
  installation_date: z.string().optional().nullable(),
  last_maintenance_date: z.string().optional().nullable(),
  next_maintenance_date: z.string().optional().nullable(),
  is_operational: z.boolean().default(true),
  notes: z.string().optional().nullable(),
})

type FormData = z.infer<typeof formSchema>

interface Props {
  initialData?: RoboticSystem
  onSubmit: (data: Partial<RoboticSystem>) => Promise<void>
  isLoading?: boolean
}

export function RoboticSystemForm({ initialData, onSubmit, isLoading }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      system_name: initialData?.system_name || '',
      model: initialData?.model || 'da Vinci Xi',
      serial_number: initialData?.serial_number || '',
      installation_date: initialData?.installation_date || '',
      last_maintenance_date: initialData?.last_maintenance_date || '',
      next_maintenance_date: initialData?.next_maintenance_date || '',
      is_operational: initialData?.is_operational ?? true,
      notes: initialData?.notes || '',
    },
  })

  const handleSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      serial_number: data.serial_number || null,
      installation_date: data.installation_date || null,
      last_maintenance_date: data.last_maintenance_date || null,
      next_maintenance_date: data.next_maintenance_date || null,
      notes: data.notes || null,
    } as any)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="system_name">Nome do Sistema *</Label>
          <Input
            id="system_name"
            placeholder="Ex: da Vinci Xi #1"
            {...form.register('system_name')}
          />
          {form.formState.errors.system_name && (
            <p className="text-sm text-red-500">{form.formState.errors.system_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Modelo *</Label>
          <Select
            onValueChange={(val) => form.setValue('model', val as any)}
            defaultValue={form.getValues('model')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="da Vinci Xi">da Vinci Xi</SelectItem>
              <SelectItem value="da Vinci X">da Vinci X</SelectItem>
              <SelectItem value="da Vinci SP">da Vinci SP</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.model && (
            <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serial_number">Número de Série</Label>
          <Input id="serial_number" {...form.register('serial_number')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installation_date">Data de Instalação</Label>
          <Input type="date" id="installation_date" {...form.register('installation_date')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_maintenance_date">Última Manutenção</Label>
          <Input
            type="date"
            id="last_maintenance_date"
            {...form.register('last_maintenance_date')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="next_maintenance_date">Próxima Manutenção</Label>
          <Input
            type="date"
            id="next_maintenance_date"
            {...form.register('next_maintenance_date')}
          />
        </div>

        <div className="space-y-2 flex flex-col justify-center">
          <Label htmlFor="is_operational" className="mb-3">
            Status Operacional
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_operational"
              checked={form.watch('is_operational')}
              onCheckedChange={(val) => form.setValue('is_operational', val)}
            />
            <span>
              {form.watch('is_operational') ? 'Ativo e Operacional' : 'Inativo / Em Manutenção'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea id="notes" rows={3} {...form.register('notes')} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Sistema Robótico'}
        </Button>
      </div>
    </form>
  )
}
