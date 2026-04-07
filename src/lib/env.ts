import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Variáveis de servidor — NUNCA expostas ao browser.
   * Sem o prefixo NEXT_PUBLIC_.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    RESEND_API_KEY: z.string().startsWith('re_'),
    EMAIL_FROM: z.string().email().optional(),
    EMAIL_TO: z.string().email().optional(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },

  /**
   * Variáveis de cliente — expostas ao browser.
   * Obrigatoriamente com prefixo NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(10, 'Número de WhatsApp inválido'),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  },

  /**
   * Mapeamento explícito — necessário pelo Next.js para tree-shaking.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },

  /**
   * Ignora validação em build na Vercel se as variáveis ainda não foram setadas.
   * Remova em produção real.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})
