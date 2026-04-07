import { z } from 'zod'

export const contatoSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo')
    .trim(),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .max(255)
    .toLowerCase()
    .trim(),
  mensagem: z
    .string({ required_error: 'Mensagem é obrigatória' })
    .min(10, 'Mensagem muito curta (mínimo 10 caracteres)')
    .max(2000, 'Mensagem muito longa (máximo 2000 caracteres)')
    .trim(),
  // Honeypot: campo invisível que bots preenchem, humanos não
  _honeypot: z.string().max(0, 'Bot detectado').optional(),
})

export type ContatoInput = z.infer<typeof contatoSchema>
