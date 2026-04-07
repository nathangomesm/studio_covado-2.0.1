'use client'
import { useState } from 'react'
import FadeInSection from '@/components/ui/FadeInSection'

export default function ContactSection() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  const [form, setForm] = useState({ nome: '', email: '', mensagem: '', _honeypot: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [erros, setErros] = useState<Record<string, string[]>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErros({})

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErros(data.details ?? {})
        setStatus('error')
        return
      }
      setStatus('success')
      setForm({ nome: '', email: '', mensagem: '', _honeypot: '' })
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid var(--color-borda)',
    fontFamily: 'var(--font-primary)', fontSize: '1rem',
    background: 'transparent', outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <section id="contato" className="secao-padrao bg-contato">
      <div className="container">
        <FadeInSection>
          <h3 className="titulo-secao">Vamos conversar?</h3>
          <p style={{ marginBottom: '2rem' }}>
            Entre em contato para transformar seu sonho em projeto.
          </p>

          {/* CTA WhatsApp */}
          <a
            href={`https://wa.me/${whatsapp}`}
            className="btn-cta"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginBottom: '3rem', display: 'inline-block' }}
          >
            Iniciar Atendimento no WhatsApp
          </a>

          {/* Ou — formulário de email */}
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '2rem 0 1.5rem', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            OU ENVIE UMA MENSAGEM
          </p>

          {status === 'success' ? (
            <p style={{ color: '#6ee7b7', fontSize: '1.1rem' }}>
              ✓ Mensagem enviada! Entraremos em contato em breve.
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '520px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Honeypot — invisível para usuários, bots preenchem */}
              <input
                type="text"
                name="_honeypot"
                value={form._honeypot}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <input
                  type="text" name="nome" placeholder="Seu nome"
                  value={form.nome} onChange={handleChange}
                  required style={{ ...inputStyle, color: 'white' }}
                />
                {erros.nome && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>{erros.nome[0]}</p>}
              </div>

              <div>
                <input
                  type="email" name="email" placeholder="Seu e-mail"
                  value={form.email} onChange={handleChange}
                  required style={{ ...inputStyle, color: 'white' }}
                />
                {erros.email && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>{erros.email[0]}</p>}
              </div>

              <div>
                <textarea
                  name="mensagem" placeholder="Sua mensagem" rows={4}
                  value={form.mensagem} onChange={handleChange}
                  required style={{ ...inputStyle, color: 'white', resize: 'vertical' }}
                />
                {erros.mensagem && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>{erros.mensagem[0]}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-cta"
                style={{ cursor: status === 'loading' ? 'wait' : 'pointer', alignSelf: 'flex-start' }}
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>

              {status === 'error' && Object.keys(erros).length === 0 && (
                <p style={{ color: '#fca5a5', fontSize: '0.9rem' }}>
                  Erro ao enviar. Tente novamente ou use o WhatsApp.
                </p>
              )}
            </form>
          )}
        </FadeInSection>
      </div>
    </section>
  )
}
