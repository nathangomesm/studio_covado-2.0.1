import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contatoSchema } from '@/lib/validations'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    // Valida Content-Type
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Tipo de conteúdo inválido.' }, { status: 400 })
    }

    // Valida origem (anti-CSRF básico)
    const origin = req.headers.get('origin') ?? ''
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'https://studiocovado.com.br',
      'https://www.studiocovado.com.br',
    ]
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: 'Origem não permitida.' }, { status: 403 })
    }

    const body = await req.json()

    // Valida e sanitiza com Zod
    const result = contatoSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: result.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // Honeypot — se preenchido, é bot. Retorna 200 para enganá-lo.
    if (result.data._honeypot) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const { nome, email, mensagem } = result.data

    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'contato@studiocovado.com.br',
      to: process.env.EMAIL_TO ?? 'contato@studiocovado.com.br',
      replyTo: email,
      subject: `Novo contato de ${nome} — Studio Côvado`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#1a1a1a;border-bottom:1px solid #e0d8cc;padding-bottom:1rem;">
            Novo contato pelo site
          </h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Mensagem:</strong></p>
          <p style="background:#f5f0e8;padding:1rem;border-radius:4px;white-space:pre-line;">${mensagem}</p>
          <hr style="border:none;border-top:1px solid #e0d8cc;margin-top:2rem;" />
          <p style="color:#999;font-size:0.8rem;">Enviado via studiocovado.com.br</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[CONTATO] Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno. Tente novamente.' }, { status: 500 })
  }
}
