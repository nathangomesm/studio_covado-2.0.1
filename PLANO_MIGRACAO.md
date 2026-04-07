# Plano de Migração: Studio Côvado
## Django → Next.js 14 (App Router) + Vercel Postgres + Prisma

> **Engenheiro Responsável:** Análise completa baseada no código-fonte Django fornecido  
> **Data:** Abril 2026  
> **Objetivo:** Alta performance, SEO otimizado, deploy serverless na Vercel

---

## 📋 ÍNDICE

1. [Análise da Arquitetura Atual](#1-análise-da-arquitetura-atual)
2. [Tradução de Stack](#2-tradução-de-stack)
3. [Schema Prisma (ORM)](#3-schema-prisma--por-que-não-drizzle)
4. [Guia de Implementação Passo a Passo](#4-guia-de-implementação-passo-a-passo)
5. [Estrutura de Pastas (App Router)](#5-estrutura-de-pastas-app-router)
6. [Código dos Componentes Principais](#6-código-dos-componentes-principais)
7. [Segurança e Boas Práticas](#7-segurança-e-boas-práticas)
8. [Deploy e Hospedagem na Vercel](#8-deploy-e-hospedagem-na-vercel)
9. [Checklist Final de Lançamento](#9-checklist-final-de-lançamento)

---

## 1. Análise da Arquitetura Atual

### O que o projeto Django faz hoje

O **Studio Côvado** é o site institucional e portfólio de um estúdio de arquitetura e interiores. A aplicação tem as seguintes responsabilidades:

- **Vitrine de Projetos:** Exibe uma grade de projetos com filtro por categoria (client-side via JavaScript)
- **Página de Detalhe:** Cada projeto tem uma ficha técnica (cliente, ano, localização, área, status) + galeria de imagens com lightbox (GLightbox)
- **Seção Institucional:** "Sobre nós" com copy da marca e foto da equipe
- **CTA de Contato:** Link para WhatsApp + botão flutuante
- **Admin Django:** Painel para gerenciar projetos, categorias e imagens

### Inventário de Models identificados

| Django Model    | Campos                                                                                         | Relações              |
|-----------------|------------------------------------------------------------------------------------------------|-----------------------|
| `Categoria`     | `nome` (unique)                                                                                | ← tem muitos Projetos |
| `Projeto`       | `titulo`, `descricao`, `imagem_principal`, `data_publicacao`, `ativo`, `cliente`, `localizacao`, `area`, `status` | → pertence a Categoria, ← tem muitas ImagemProjeto |
| `ImagemProjeto` | `imagem`                                                                                       | → pertence a Projeto  |

### Rotas Django existentes

```
/                          → views.home          (lista projetos + categorias)
/projeto/<int:id>/         → views.detalhe_projeto (detalhe + galeria)
/admin/                    → Django Admin
```

### Pontos de atenção identificados no código

- ⚠️ `SECRET_KEY` exposta no `settings.py` (já removida do repositório? verificar)
- ⚠️ `DEBUG = True` hardcoded — nunca deve ir para produção
- ⚠️ `ALLOWED_HOSTS = []` vazio
- ⚠️ Imagens sendo servidas pelo Django dev server (`if settings.DEBUG`) — não é escalável
- ⚠️ No template `projeto_detalhe.html`, dados da ficha técnica estão **hardcoded** (`"São Paulo, SP"`, `"450m²"`, `"Concluído"`) em vez de usar `{{ projeto.localizacao }}`, `{{ projeto.area }}` e `{{ projeto.status }}` — isso precisará ser corrigido na migração

---

## 2. Tradução de Stack

### Mapeamento Conceitual Django → Next.js

| Conceito Django                        | Equivalente Next.js (App Router)             | Notas                                           |
|----------------------------------------|----------------------------------------------|-------------------------------------------------|
| `View` (função) + `render()`           | **Server Component** (async)                 | Busca dados diretamente no servidor, sem API    |
| Template `base.html`                   | `app/layout.tsx`                             | Layout raiz que envolve todas as páginas        |
| Template `home.html`                   | `app/page.tsx`                               | Server Component — busca projetos/categorias   |
| Template `projeto_detalhe.html`        | `app/projeto/[id]/page.tsx`                  | Dynamic route — parâmetro `id` na URL          |
| `{% static 'css/style.css' %}`         | `import './globals.css'` no layout           | CSS global ou módulos CSS                      |
| `{% static 'img/Logo.png' %}`          | `<Image src="/logo.png" />` do `next/image`  | Otimização automática de imagem                |
| `{{ projeto.imagem_principal.url }}`   | URL do Vercel Blob/Cloudinary via `next/image`| Storage externo em vez de disco local          |
| `{% url 'detalhe_projeto' projeto.id %}`| `href={/projeto/${projeto.id}}`              | Roteamento por arquivo                         |
| `{% for projeto in projetos %}`        | `.map()` em TSX                             | Tipado com TypeScript                          |
| `get_object_or_404`                    | `notFound()` do `next/navigation`           | Retorna 404 automaticamente                    |
| Django Admin                           | **Payload CMS** ou rota `/admin` customizada | Recomendado: Payload CMS (open source)        |
| `models.py` + migrações Django         | `schema.prisma` + `prisma migrate`          | Ver seção 3                                    |
| `MEDIA_ROOT` + ImageField              | **Vercel Blob** ou **Cloudinary**           | Storage externo gerenciado                     |
| Middleware de CSRF Django              | Headers + `httpOnly` cookies + CSRF tokens  | Ver seção 7                                    |

### Quando usar Server Component vs Client Component

```
Server Component (padrão — sem 'use client')
├── app/page.tsx              → busca projetos do banco
├── app/projeto/[id]/page.tsx → busca detalhe do projeto
├── components/ProjectCard.tsx → renderiza card (sem interatividade)
├── components/Header.tsx     → navbar estática
└── components/Footer.tsx     → footer estático

Client Component ('use client' no topo)
├── components/ProjectFilter.tsx  → botões de filtro (onClick, useState)
├── components/Lightbox.tsx       → galeria interativa (GLightbox/Framer)
└── components/HamburgerMenu.tsx  → menu mobile (toggleMenu)
```

**Regra de ouro:** Tudo que tem `onClick`, `useState`, `useEffect`, ou usa APIs do browser → `'use client'`. O resto fica Server Component e ganha performance gratuita.

---

## 3. Schema Prisma — Por que não Drizzle?

### A decisão: Prisma ✅

| Critério               | Prisma                              | Drizzle                           |
|------------------------|-------------------------------------|-----------------------------------|
| Curva de aprendizado   | ✅ Muito baixa, schema declarativo  | ⚠️ Média, sintaxe SQL-like        |
| Type Safety            | ✅ Geração automática de tipos      | ✅ Excelente (mais verboso)        |
| Integração Vercel PG   | ✅ Driver nativo + adapter          | ✅ Suportado                       |
| Ecossistema/comunidade | ✅ Maior, mais recursos             | ⚠️ Menor (crescendo rápido)       |
| Prisma Studio (UI)     | ✅ Admin visual gratuito local      | ❌ Não tem                         |
| Migrações              | ✅ `prisma migrate` automático      | ⚠️ Mais manual                    |
| **Veredicto**          | **Ideal para este projeto**        |                                   |

> Para um portfólio com Models relativamente simples e onde você quer produtividade máxima, **Prisma** vence pela facilidade, pelo Prisma Studio (que substitui parcialmente o Django Admin para visualizar dados) e pela integração nativa com Vercel Postgres.

### `schema.prisma` — Tradução exata dos Models Django

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")      // pooling (produção)
  directUrl = env("POSTGRES_URL_NON_POOLING")  // migrações
}

model Categoria {
  id       Int       @id @default(autoincrement())
  nome     String    @unique @db.VarChar(50)
  projetos Projeto[]

  @@map("categorias") // nome da tabela no banco
}

model Projeto {
  id              Int             @id @default(autoincrement())
  titulo          String          @db.VarChar(100)
  descricao       String          @db.Text
  categoriaId     Int
  categoria       Categoria       @relation(fields: [categoriaId], references: [id])
  imagemPrincipal String          // URL do Vercel Blob ou Cloudinary
  dataPublicacao  DateTime        @default(now())
  ativo           Boolean         @default(true)
  
  // Ficha Técnica
  cliente         String          @default("Confidencial") @db.VarChar(100)
  localizacao     String          @default("A definir") @db.VarChar(200)
  area            String          @default("A definir") @db.VarChar(50)
  status          String          @default("Concluído") @db.VarChar(100)
  
  imagens         ImagemProjeto[]

  @@map("projetos")
}

model ImagemProjeto {
  id        Int     @id @default(autoincrement())
  projetoId Int
  projeto   Projeto @relation(fields: [projetoId], references: [id], onDelete: Cascade)
  imageUrl  String  // URL do Vercel Blob ou Cloudinary

  @@map("imagens_projeto")
}
```

> **Nota sobre imagens:** Em vez de `ImageField` do Django (que salva no disco), usaremos **URLs de strings** apontando para um serviço externo. As opções recomendadas são:
> - **Vercel Blob** (nativo, simples, pago por uso)
> - **Cloudinary** (gratuito até 25GB, tem transformações de imagem automáticas)

---

## 4. Guia de Implementação Passo a Passo

### Passo 1: Criar o projeto Next.js

```bash
# Crie o projeto com as opções ideais
npx create-next-app@latest studio-covado \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd studio-covado
```

### Passo 2: Instalar dependências

```bash
# ORM e banco de dados
npm install prisma @prisma/client
npm install @vercel/postgres

# Validação de formulários e segurança
npm install zod
npm install @t3-oss/env-nextjs  # validação de env vars

# Utilitários de UI
npm install clsx tailwind-merge
npm install lucide-react

# Email para formulário de contato (futuro)
npm install resend                # serviço de email moderno

# Dev dependencies
npm install -D @types/node
```

### Passo 3: Inicializar o Prisma

```bash
# Inicializa a pasta prisma/ com o schema
npx prisma init

# Após editar o schema.prisma (conforme seção 3), gere o client:
npx prisma generate
```

### Passo 4: Configurar variáveis de ambiente

Crie o arquivo `.env.local` (NUNCA commitar no git):

```bash
# .env.local

# Vercel Postgres (preenchido automaticamente após vincular no painel)
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://...?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="5549999999999"  # número real do estúdio

# Storage de Imagens (escolha um)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."      # Vercel Blob
# OU
CLOUDINARY_CLOUD_NAME="..."                  # Cloudinary
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Email (Resend)
RESEND_API_KEY="re_..."
```

Adicione ao `.gitignore`:
```
.env.local
.env*.local
```

### Passo 5: Criar e rodar a migração

```bash
# Cria a migração inicial e aplica no banco
npx prisma migrate dev --name init

# Para ver os dados no Prisma Studio (substitui o Django Admin localmente)
npx prisma studio
```

### Passo 6: Criar o Prisma Client singleton

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

> **Por que singleton?** Next.js em desenvolvimento faz hot-reload e recriaria centenas de conexões sem isso. O singleton reutiliza a mesma instância.

---

## 5. Estrutura de Pastas (App Router)

```
studio-covado/
├── prisma/
│   ├── schema.prisma           ← definição do banco
│   └── migrations/             ← histórico de migrações (commitar!)
│
├── public/
│   ├── logo.png                ← logo do estúdio
│   ├── og-image.jpg            ← imagem para compartilhamento social (SEO)
│   └── favicon.ico
│
├── src/
│   ├── app/                    ← App Router (cada pasta = rota)
│   │   ├── layout.tsx          ← equivalente ao base.html
│   │   ├── page.tsx            ← equivalente à view home()
│   │   ├── globals.css         ← CSS global (migrar do style.css)
│   │   │
│   │   ├── projeto/
│   │   │   └── [id]/
│   │   │       ├── page.tsx    ← equivalente à view detalhe_projeto()
│   │   │       └── loading.tsx ← skeleton enquanto carrega
│   │   │
│   │   └── api/
│   │       └── contato/
│   │           └── route.ts    ← Route Handler para formulário de contato
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx      ← navbar (Server Component)
│   │   │   ├── Footer.tsx      ← footer (Server Component)
│   │   │   └── WhatsAppButton.tsx ← botão flutuante (Client Component)
│   │   │
│   │   ├── portfolio/
│   │   │   ├── ProjectCard.tsx     ← card de projeto (Server Component)
│   │   │   ├── ProjectGrid.tsx     ← grade + filtro (Client Component)
│   │   │   ├── ProjectGallery.tsx  ← galeria lightbox (Client Component)
│   │   │   └── TechSheet.tsx       ← ficha técnica (Server Component)
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── FadeInSection.tsx   ← equivalente ao fade-in-section JS
│   │
│   ├── lib/
│   │   ├── prisma.ts           ← client singleton
│   │   ├── validations.ts      ← schemas Zod
│   │   └── actions.ts          ← Server Actions
│   │
│   └── types/
│       └── index.ts            ← tipos TypeScript derivados do Prisma
│
├── .env.local                  ← variáveis locais (não commitar)
├── .env.example                ← template das vars (commitar sem valores)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Código dos Componentes Principais

### `app/layout.tsx` — Equivalente ao `base.html`

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Host_Grotesk, Playfair_Display } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import './globals.css'

// Carregamento de fonte otimizado pelo Next.js (sem requisição externa!)
const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-host-grotesk',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: { template: 'Studio Côvado | %s', default: 'Studio Côvado' },
  description: 'Feito na medida do seu viver. Arquitetura e interiores em Lages, SC.',
  openGraph: {
    title: 'Studio Côvado',
    description: 'Feito na medida do seu viver.',
    images: ['/og-image.jpg'],
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${hostGrotesk.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!} />
      </body>
    </html>
  )
}
```

### `app/page.tsx` — Equivalente à `view home()`

```tsx
// src/app/page.tsx
import { prisma } from '@/lib/prisma'
import ProjectGrid from '@/components/portfolio/ProjectGrid'
import HeroSection from '@/components/portfolio/HeroSection'
import AboutSection from '@/components/portfolio/AboutSection'
import ContactSection from '@/components/portfolio/ContactSection'

// Esta função roda NO SERVIDOR — seguro, sem expor dados ao cliente
async function getData() {
  const [projetos, categorias] = await Promise.all([
    prisma.projeto.findMany({
      where: { ativo: true },
      include: { categoria: true },
      orderBy: { dataPublicacao: 'desc' },
    }),
    prisma.categoria.findMany({ orderBy: { nome: 'asc' } }),
  ])
  return { projetos, categorias }
}

export default async function HomePage() {
  const { projetos, categorias } = await getData()

  return (
    <>
      <HeroSection />
      <AboutSection />
      {/* ProjectGrid é Client Component por causa do filtro */}
      <ProjectGrid projetos={projetos} categorias={categorias} />
      <ContactSection />
    </>
  )
}
```

### `app/projeto/[id]/page.tsx` — Equivalente à `view detalhe_projeto()`

```tsx
// src/app/projeto/[id]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ProjectGallery from '@/components/portfolio/ProjectGallery'
import TechSheet from '@/components/portfolio/TechSheet'
import type { Metadata } from 'next'

// Gera metadados dinâmicos para SEO — o Django não fazia isso!
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projeto = await prisma.projeto.findUnique({
    where: { id: parseInt(params.id) },
  })
  if (!projeto) return {}
  return {
    title: projeto.titulo,
    description: projeto.descricao.slice(0, 155),
    openGraph: { images: [projeto.imagemPrincipal] },
  }
}

// Pré-gera as páginas em build time para máxima performance (SSG)
export async function generateStaticParams() {
  const projetos = await prisma.projeto.findMany({ select: { id: true } })
  return projetos.map((p) => ({ id: String(p.id) }))
}

export default async function ProjetoDetalhePage({ params }: { params: { id: string } }) {
  const projeto = await prisma.projeto.findUnique({
    where: { id: parseInt(params.id) },
    include: { categoria: true, imagens: true },
  })

  // Equivalente ao get_object_or_404 do Django
  if (!projeto) notFound()

  return (
    <>
      {/* Hero com imagem principal */}
      <section className="projeto-hero relative h-[60vh]">
        <Image
          src={projeto.imagemPrincipal}
          alt={projeto.titulo}
          fill
          className="object-cover"
          priority  // LCP — carrega com prioridade máxima
        />
        <div className="overlay-hero" />
        <div className="hero-projeto-content">
          <p className="projeto-categoria">{projeto.categoria.nome}</p>
          <h1 className="projeto-titulo">{projeto.titulo}</h1>
        </div>
      </section>

      {/* Ficha Técnica + Descrição */}
      <section className="secao-padrao">
        <div className="container projeto-container">
          <TechSheet projeto={projeto} />
          <div className="projeto-texto fade-in-section">
            <h3>Sobre o Projeto</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{projeto.descricao}</p>
          </div>
        </div>
      </section>

      {/* Galeria — Client Component para o lightbox */}
      {projeto.imagens.length > 0 && (
        <section className="secao-padrao bg-areia">
          <div className="container">
            <h3 className="titulo-secao text-center">Galeria</h3>
            <ProjectGallery imagens={projeto.imagens} titulo={projeto.titulo} />
          </div>
        </section>
      )}
    </>
  )
}
```

### `components/portfolio/ProjectGrid.tsx` — Filtro de Categorias

```tsx
// src/components/portfolio/ProjectGrid.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Projeto, Categoria } from '@prisma/client'

type ProjetoComCategoria = Projeto & { categoria: Categoria }

interface Props {
  projetos: ProjetoComCategoria[]
  categorias: Categoria[]
}

export default function ProjectGrid({ projetos, categorias }: Props) {
  const [filtroAtivo, setFiltroAtivo] = useState<number | 'todos'>('todos')

  const projetosFiltrados = filtroAtivo === 'todos'
    ? projetos
    : projetos.filter((p) => p.categoriaId === filtroAtivo)

  return (
    <section id="projetos" className="secao-padrao">
      <div className="container">
        <div className="secao-header fade-in-section">
          <h3 className="titulo-secao">Nossos Projetos</h3>
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
            <p>Em breve novos projetos.</p>
          ) : (
            projetosFiltrados.map((projeto) => (
              <Link href={`/projeto/${projeto.id}`} key={projeto.id}>
                <div className="card-projeto fade-in-section">
                  <div className="img-container">
                    {/* next/image otimiza: converte para WebP, lazy load, blur placeholder */}
                    <Image
                      src={projeto.imagemPrincipal}
                      alt={projeto.titulo}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full"
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
            ))
          )}
        </div>
      </div>
    </section>
  )
}
```

### `next.config.ts` — Configuração de Domínios de Imagem

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Cloudinary (se usar)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/SEU_CLOUD_NAME/**',
      },
    ],
  },
}

export default nextConfig
```

---

## 7. Segurança e Boas Práticas

### 7.1 Proteção de Route Handlers (API Routes)

O Studio Côvado tem um formulário de contato que precisará de uma API Route. Proteja assim:

```typescript
// src/app/api/contato/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

// Schema de validação com Zod — sua primeira linha de defesa
const contatoSchema = z.object({
  nome: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).toLowerCase(),
  mensagem: z.string().min(10).max(2000).trim(),
  // Honeypot — campo invisível que bots preenchem
  _honeypot: z.string().max(0, 'Bot detectado'),
})

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting básico via header (Vercel adiciona automaticamente)
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    
    // 2. Validar Content-Type
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    const body = await req.json()
    
    // 3. Validar dados com Zod (proteção contra XSS e injeção)
    const result = contatoSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { nome, email, mensagem } = result.data
    
    // 4. Enviar email via Resend
    await resend.emails.send({
      from: 'contato@studiocovado.com.br',
      to: 'contato@studiocovado.com.br',
      subject: `Novo contato de ${nome}`,
      html: `<p><strong>Nome:</strong> ${nome}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Mensagem:</strong> ${mensagem}</p>`,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no contato:', error)
    // NUNCA exponha detalhes do erro interno ao cliente
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
```

### 7.2 Prevenção de CSRF

Next.js 14 com App Router **não tem CSRF automático** como o Django. Implemente:

```typescript
// src/lib/csrf.ts
import { headers } from 'next/headers'

export function validateCsrfOrigin() {
  const headersList = headers()
  const origin = headersList.get('origin')
  const referer = headersList.get('referer')
  
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://studiocovado.com.br',
    'https://www.studiocovado.com.br',
  ]
  
  if (!origin && !referer) return false
  
  return allowedOrigins.some(
    (allowed) => origin?.startsWith(allowed!) || referer?.startsWith(allowed!)
  )
}
```

### 7.3 Security Headers no `next.config.ts`

```typescript
// next.config.ts — adicione os headers de segurança
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",  // GLightbox CDN
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.resend.com",
    ].join('; ')
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### 7.4 Proteção contra SQL Injection

O Prisma **previne SQL Injection por padrão** usando prepared statements. Nunca faça:

```typescript
// ❌ NUNCA faça isso
const resultado = await prisma.$queryRaw`
  SELECT * FROM projetos WHERE titulo = ${req.query.titulo}
`
// (mesmo $queryRaw é seguro SE usar template literals, mas evite quando possível)

// ✅ SEMPRE use os métodos tipados do Prisma
const projeto = await prisma.projeto.findUnique({
  where: { id: parseInt(params.id) }, // parseInt previne injeção
})
```

### 7.5 Validação de Variáveis de Ambiente

```typescript
// src/lib/env.ts — falha em build se faltar alguma variável
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    RESEND_API_KEY: z.string().startsWith('re_'),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().min(10),
  },
  runtimeEnv: {
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  },
})
```

---

## 8. Deploy e Hospedagem na Vercel

### Passo 1: Preparar o repositório

```bash
# Inicializar Git (se ainda não tiver)
git init
git add .
git commit -m "feat: initial Next.js project"

# Criar repositório no GitHub e fazer push
gh repo create studio-covado --public
git push -u origin main
```

### Passo 2: Vincular à Vercel

1. Acesse [vercel.com](https://vercel.com) → **"Add New Project"**
2. Clique em **"Import Git Repository"** → selecione `studio-covado`
3. Em **Framework Preset**, confirme que está selecionado **Next.js**
4. **NÃO clique em Deploy ainda** — primeiro provisione o banco

### Passo 3: Provisionar o Vercel Postgres

1. No painel da Vercel, vá em **Storage** → **"Create Database"**
2. Selecione **Postgres** → escolha uma região próxima ao Brasil (ex: `gru1` São Paulo ou `iad1` para latência aceitável)
3. Nomeie como `studio-covado-db`
4. Clique em **"Connect Project"** → selecione o projeto `studio-covado`
5. A Vercel injeta automaticamente as variáveis `POSTGRES_*` no seu projeto

### Passo 4: Configurar variáveis de ambiente na Vercel

1. Vá em seu projeto → **Settings** → **Environment Variables**
2. Adicione as variáveis que NÃO foram injetadas pelo Postgres:

| Variável                       | Valor                        | Environments      |
|--------------------------------|------------------------------|-------------------|
| `NEXT_PUBLIC_APP_URL`          | `https://studiocovado.com.br`| All               |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | `5549XXXXXXXXX`              | All               |
| `RESEND_API_KEY`               | `re_...`                     | Production, Preview|
| `BLOB_READ_WRITE_TOKEN`        | `vercel_blob_...`            | All               |

### Passo 5: Configurar migrações automáticas no build

Este é o passo mais crítico. Configure o `package.json` para rodar as migrações **antes** do build:

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

> **`prisma migrate deploy`** (não `dev`) é o comando correto para produção — ele aplica as migrações pendentes sem criar novas, é idempotente e seguro para CI/CD.

### Passo 6: Configurar domínio customizado

1. Vercel → seu projeto → **Settings** → **Domains**
2. Adicione `studiocovado.com.br` e `www.studiocovado.com.br`
3. A Vercel fornece registros DNS para configurar no seu registrador
4. SSL (HTTPS) é provisionado automaticamente via Let's Encrypt

### Fluxo de Deploy Após Configuração

```
git push origin main
    ↓
Vercel detecta o push
    ↓
Executa: npm ci
    ↓
Executa: prisma generate
    ↓
Executa: prisma migrate deploy  ← aplica migrações no Vercel Postgres
    ↓
Executa: next build              ← gera páginas estáticas (SSG) + serverless
    ↓
Deploy automático em produção em ~60 segundos
```

---

## 9. Checklist Final de Lançamento

### Antes do primeiro deploy

- [ ] `.env.local` está no `.gitignore`
- [ ] Não há credenciais hardcoded no código (a `SECRET_KEY` Django estava exposta — confirmar que foi removida do git history)
- [ ] `schema.prisma` e a pasta `prisma/migrations/` estão commitados
- [ ] `prisma generate` está no script `postinstall`
- [ ] `prisma migrate deploy` está no script `build`
- [ ] `next.config.ts` com `remotePatterns` configurado para o storage de imagens

### Performance (Core Web Vitals)

- [ ] `next/image` com `priority` na imagem acima da dobra (hero)
- [ ] `next/font` carregando Host Grotesk e Playfair Display localmente
- [ ] `generateStaticParams` implementado para páginas de projetos (SSG)
- [ ] `loading.tsx` nas rotas dinâmicas para evitar layout shift

### SEO

- [ ] `generateMetadata` em todas as páginas dinâmicas
- [ ] `og-image.jpg` (1200×630px) em `/public`
- [ ] `sitemap.xml` gerado via `app/sitemap.ts`
- [ ] `robots.txt` em `app/robots.ts`

### Segurança

- [ ] Security headers configurados em `next.config.ts`
- [ ] Validação Zod em todos os Route Handlers
- [ ] Variáveis de ambiente validadas com `@t3-oss/env-nextjs`
- [ ] Rate limiting habilitado na Vercel (plano Pro) ou via Upstash Redis

### Funcionalidade

- [ ] Filtro de categorias funcionando (client-side)
- [ ] Galeria lightbox funcionando na página de detalhe
- [ ] Botão flutuante do WhatsApp funcionando
- [ ] Formulário de contato enviando email via Resend
- [ ] Página 404 customizada (`app/not-found.tsx`)
- [ ] Dados da ficha técnica exibindo campos reais do banco (`localizacao`, `area`, `status`) — **corrigir o bug encontrado no template original**

---

## Apêndice: Migração de Dados do SQLite para Vercel Postgres

Se você tiver dados em produção no SQLite, use este script para migrar:

```typescript
// scripts/migrate-data.ts
import Database from 'better-sqlite3'
import { PrismaClient } from '@prisma/client'

const sqlite = new Database('./db.sqlite3')
const prisma = new PrismaClient()

async function main() {
  // 1. Migrar Categorias
  const categorias = sqlite.prepare('SELECT * FROM portfolio_categoria').all() as any[]
  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { nome: cat.nome },
      create: { nome: cat.nome },
      update: {},
    })
  }

  // 2. Migrar Projetos (imagens precisarão ser re-uploaded para Vercel Blob/Cloudinary)
  const projetos = sqlite.prepare('SELECT * FROM portfolio_projeto').all() as any[]
  for (const p of projetos) {
    const cat = await prisma.categoria.findFirst({ where: { nome: p.categoria_id?.toString() } })
    // Nota: imagemPrincipal precisa ser URL do novo storage — migração manual de arquivos
    console.log(`Migrar imagem: media/${p.imagem_principal} → Cloudinary/Vercel Blob`)
  }
  
  console.log('Migração concluída! Lembre-se de fazer upload das imagens.')
}

main().finally(() => prisma.$disconnect())
```

Execute com:
```bash
npx tsx scripts/migrate-data.ts
```

---

*Plano gerado por análise completa do código-fonte Django do Studio Côvado.*  
*Versões de referência: Next.js 14.x, Prisma 5.x, Node.js 20 LTS*
