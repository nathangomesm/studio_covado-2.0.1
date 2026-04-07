import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/portfolio/HeroSection'
import AboutSection from '@/components/portfolio/AboutSection'
import ProjectGrid from '@/components/portfolio/ProjectGrid'
import ContactSection from '@/components/portfolio/ContactSection'

async function getData() {
  const [projetos, categorias] = await Promise.all([
    prisma.projeto.findMany({
      where: { ativo: true },
      include: { categoria: true },
      orderBy: { dataPublicacao: 'desc' },
    }),
    prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
    }),
  ])
  return { projetos, categorias }
}

export default async function HomePage() {
  const { projetos, categorias } = await getData()

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectGrid projetos={projetos} categorias={categorias} />
      <ContactSection />
    </>
  )
}
