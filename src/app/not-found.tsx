import Link from 'next/link'

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'var(--color-areia)',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: 'clamp(4rem, 15vw, 10rem)',
          fontWeight: 400,
          color: 'var(--color-borda)',
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '1.5rem',
          fontWeight: 400,
          margin: '1rem 0',
          fontStyle: 'italic',
        }}
      >
        Página não encontrada
      </h2>
      <p style={{ color: 'var(--color-cinza)', marginBottom: '2rem' }}>
        O projeto ou página que você procura não existe ou foi removido.
      </p>
      <Link href="/" className="btn-voltar" style={{ fontSize: '0.9rem' }}>
        ← Voltar para a Home
      </Link>
    </section>
  )
}
