import * as z from 'zod'

export const resourceAllocationSchema = z.object({
  pedido_id: z.string().uuid('Selecione o pedido cirúrgico'),
  surgical_room_id: z.string().uuid('Selecione a sala cirúrgica'),
  robotic_system_id: z.string().uuid('Selecione o sistema robótico'),
  surgical_block_id: z.string().uuid('Selecione o bloco cirúrgico'),
  allocated_surgeon_id: z.string().uuid('Selecione o cirurgião'),
  allocated_proctor_id: z.string().uuid().optional().or(z.literal('')),
  estimated_duration_minutes: z.coerce.number().min(1, 'Duração deve ser pelo menos 1'),
  allocation_status: z.enum(['ALOCADO', 'CONFIRMADO', 'CANCELADO']).default('ALOCADO'),
})

export type ResourceAllocationFormValues = z.infer<typeof resourceAllocationSchema>
