'use client'
import { useState } from 'react'
import Image from 'next/image'
import type { ImagemProjeto } from '@/types'

interface Props {
  imagens: ImagemProjeto[]
  titulo: string
}

export default function ProjectGallery({ imagens, titulo }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const fechar = () => setLightboxIndex(null)
  const anterior = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + imagens.length) % imagens.length : 0))
  const proximo = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % imagens.length : 0))

  return (
    <>
      {/* Grade de thumbnails */}
      <div className="galeria-grid">
        {imagens.map((item, index) => (
          <div
            key={item.id}
            className="galeria-item"
            onClick={() => setLightboxIndex(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setLightboxIndex(index)}
            aria-label={`Abrir imagem ${index + 1} de ${titulo}`}
          >
            <Image
              src={item.imageUrl}
              alt={`${titulo} — foto ${index + 1}`}
              width={600}
              height={450}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox nativo (sem dependência externa) */}
      {lightboxIndex !== null && (
        <div
          onClick={fechar}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Botão fechar */}
          <button
            onClick={fechar}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              background: 'none', border: 'none', color: 'white',
              fontSize: '2rem', cursor: 'pointer', lineHeight: 1,
            }}
            aria-label="Fechar"
          >
            ×
          </button>

          {/* Botão anterior */}
          <button
            onClick={(e) => { e.stopPropagation(); anterior() }}
            style={{
              position: 'absolute', left: '1rem',
              background: 'none', border: 'none', color: 'white',
              fontSize: '2.5rem', cursor: 'pointer', padding: '1rem',
            }}
            aria-label="Imagem anterior"
          >
            ‹
          </button>

          {/* Imagem principal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh' }}
          >
            <Image
              src={imagens[lightboxIndex].imageUrl}
              alt={`${titulo} — foto ${lightboxIndex + 1}`}
              width={1400}
              height={900}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain' }}
              priority
            />
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem' }}>
              {lightboxIndex + 1} / {imagens.length}
            </p>
          </div>

          {/* Botão próximo */}
          <button
            onClick={(e) => { e.stopPropagation(); proximo() }}
            style={{
              position: 'absolute', right: '1rem',
              background: 'none', border: 'none', color: 'white',
              fontSize: '2.5rem', cursor: 'pointer', padding: '1rem',
            }}
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
