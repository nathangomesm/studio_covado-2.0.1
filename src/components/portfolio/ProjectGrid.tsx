'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FadeInSection from '@/components/ui/FadeInSection'
import type { ProjetoComCategoria, Categoria } from '@/types'

interface Props {
  projetos: ProjetoComCategoria[]
  categorias: Categoria[]
}

export default function ProjectGrid({ projetos, categorias }: Props) {
  const [filtroAtivo, setFiltroAtivo] = useState<number | 'todos'>('todos')

  const projetosFiltrados =
    filtroAtivo === 'todos'
      ? projetos
      : projetos.filter((p) => p.categoriaId === filtroAtivo)

  return (
    <section id="projetos" className="secao-padrao">
      <div className="container">
        <div className="secao-header">
          <FadeInSection>
            <h3 className="titulo-secao">Nossos Projetos</h3>
          </FadeInSection>

          <div className="filtros">
            <button
              className={`btn-filtro ${filtroAtivo === 'todos' ? 'ativo' : ''}`}
              onClick={() => setFiltroAtivo('todos')}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                className={`btn-filtro ${filtroAtivo === cat.id ? 'ativo' : ''}`}
                onClick={() => setFiltroAtivo(cat.id)}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-projetos">
          {projetosFiltrados.length === 0 ? (
            <p style={{ color: 'var(--color-cinza)' }}>Em breve novos projetos.</p>
          ) : (
            projetosFiltrados.map((projeto) => (
              <FadeInSection key={projeto.id}>
                <Link href={`/projeto/${projeto.id}`}>
                  <div className="card-projeto">
                    <div className="img-container">
                      <Image
                        src={projeto.imagemPrincipal}
                        alt={projeto.titulo}
                        width={600}
                        height={450}
                        className="object-cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="overlay">
                        <span className="ver-mais">Ver Projeto</span>
                      </div>
                    </div>
                    <div className="card-info">
                      <h4>{projeto.titulo}</h4>
                      <p>{projeto.categoria.nome}</p>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
