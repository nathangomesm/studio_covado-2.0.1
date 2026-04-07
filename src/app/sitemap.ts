import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://studiocovado.com.br'

  const projetos = await prisma.projeto.findMany({
    where: { ativo: true },
    select: { id: true, dataPublicacao: true },
  })

  const projetoUrls = projetos.map((p) => ({
    url: `${baseUrl}/projeto/${p.id}`,
    lastModified: p.dataPublicacao,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...projetoUrls,
  ]
}
