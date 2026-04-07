import * as z from 'zod'

export const resourceAllocationSchema = z
  .object({
    pedido_id: z.string().min(1, 'Selecione o pedido cirúrgico'),
    surgical_room_id: z.string().min(1, 'Selecione a sala cirúrgica'),
    robotic_system_id: z.string().min(1, 'Selecione o sistema robótico'),
    surgical_block_id: z.string().min(1, 'Selecione o bloco cirúrgico'),
    allocated_surgeon_id: z.string().min(1, 'Selecione o cirurgião'),
    allocated_proctor_id: z.string().optional().nullable().or(z.literal('none')),
    estimated_duration_minutes: z.coerce.number().min(1, 'Duração deve ser pelo menos 1'),
    allocation_status: z.enum(['ALOCADO', 'CONFIRMADO', 'CANCELADO']).default('ALOCADO'),
    is_fallback_allocation: z.boolean().default(false),
    fallback_reason: z.string().optional(),
    selected_preference_order: z.number().nullable().optional(),
    original_preference_id: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.is_fallback_allocation &&
      (!data.fallback_reason || data.fallback_reason.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Motivo é obrigatório quando alocando fora das preferências',
        path: ['fallback_reason'],
      })
    }
  })

export type ResourceAllocationFormValues = z.infer<typeof resourceAllocationSchema>
