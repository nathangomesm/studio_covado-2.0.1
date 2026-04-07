import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProjectGallery from '@/components/portfolio/ProjectGallery'
import TechSheet from '@/components/portfolio/TechSheet'
import FadeInSection from '@/components/ui/FadeInSection'

interface Props {
  params: { id: string }
}

// ── Metadados dinâmicos para SEO ────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id)
  if (isNaN(id)) return {}

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    select: { titulo: true, descricao: true, imagemPrincipal: true },
  })

  if (!projeto) return {}

  return {
    title: projeto.titulo,
    description: projeto.descricao.slice(0, 155),
    openGraph: {
      title: `${projeto.titulo} — Studio Côvado`,
      description: projeto.descricao.slice(0, 155),
      images: [{ url: projeto.imagemPrincipal, alt: projeto.titulo }],
    },
  }
}

// ── Pré-gera páginas em build (SSG) para máxima performance ─────────────────
export async function generateStaticParams() {
  const projetos = await prisma.projeto.findMany({
    where: { ativo: true },
    select: { id: true },
  })
  return projetos.map((p) => ({ id: String(p.id) }))
}

// ── Página ────────────────────────────────────────────────────────────────────
export default async function ProjetoDetalhePage({ params }: Props) {
  const id = parseInt(params.id)
  if (isNaN(id)) notFound()

  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: { categoria: true, imagens: true },
  })

  // Equivalente ao get_object_or_404 do Django
  if (!projeto || !projeto.ativo) notFound()

  return (
    <>
      {/* Hero com imagem principal */}
      <section className="projeto-hero">
        <Image
          src={projeto.imagemPrincipal}
          alt={projeto.titulo}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="overlay-hero" />
        <div className="hero-projeto-content">
          <FadeInSection>
            <p className="projeto-categoria">{projeto.categoria.nome}</p>
            <h1 className="projeto-titulo">{projeto.titulo}</h1>
          </FadeInSection>
        </div>
      </section>

      {/* Ficha Técnica + Descrição */}
      <section className="secao-padrao">
        <div className="container projeto-container">
          <FadeInSection>
            <TechSheet projeto={projeto} />
          </FadeInSection>

          <FadeInSection>
            <div className="projeto-texto">
              <h3>Sobre o Projeto</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{projeto.descricao}</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Galeria */}
      <section className="secao-padrao bg-areia">
        <div className="container">
          <h3 className="titulo-secao" style={{ textAlign: 'center' }}>Galeria</h3>
          {projeto.imagens.length > 0 ? (
            <ProjectGallery imagens={projeto.imagens} titulo={projeto.titulo} />
          ) : (
            <p style={{ textAlign: 'center', color: '#999' }}>Galeria em breve.</p>
          )}
        </div>
      </section>
    </>
  )
}
