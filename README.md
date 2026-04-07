# Studio Côvado — Next.js

Site institucional e portfólio do Studio Côvado, migrado de Django para **Next.js 15** com App Router, **Vercel Postgres** e **Prisma**.

## Stack

| Camada       | Tecnologia                          |
|--------------|-------------------------------------|
| Framework    | Next.js 15 (App Router)             |
| Linguagem    | TypeScript                          |
| Estilo       | Tailwind CSS + CSS Global           |
| Banco        | Vercel Postgres (PostgreSQL)        |
| ORM          | Prisma 5                            |
| Storage      | Vercel Blob ou Cloudinary           |
| Email        | Resend                              |
| Deploy       | Vercel                              |

---

## Pré-requisitos

- Node.js 20 LTS ou superior
- Conta na [Vercel](https://vercel.com)
- Banco Vercel Postgres provisionado (ver seção Deploy)

---

## Configuração local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/studio-covado.git
cd studio-covado

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Rode a migração inicial do banco
npx prisma migrate dev --name init

# 5. (Opcional) Abra o Prisma Studio para gerenciar dados
npx prisma studio

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Scripts disponíveis

| Comando              | O que faz                                      |
|----------------------|------------------------------------------------|
| `npm run dev`        | Servidor de desenvolvimento                    |
| `npm run build`      | Build de produção (inclui migrate deploy)      |
| `npm run start`      | Servidor de produção                           |
| `npm run studio`     | Abre o Prisma Studio (admin visual local)      |
| `npm run migrate:dev`| Cria nova migração em desenvolvimento          |

---

## Estrutura de pastas

```
src/
├── app/                    # Rotas (App Router)
│   ├── layout.tsx          # Layout raiz (navbar, footer, fonts)
│   ├── page.tsx            # Home (hero, sobre, projetos, contato)
│   ├── projeto/[id]/       # Página de detalhe do projeto
│   ├── api/contato/        # Route Handler do formulário
│   ├── sitemap.ts          # Sitemap dinâmico (SEO)
│   └── robots.ts           # robots.txt (SEO)
├── components/
│   ├── layout/             # Header, Footer, WhatsAppButton, MobileMenu
│   ├── portfolio/          # HeroSection, AboutSection, ProjectGrid, etc.
│   └── ui/                 # FadeInSection (componente de animação)
├── lib/
│   ├── prisma.ts           # Singleton do Prisma Client
│   ├── validations.ts      # Schemas Zod (formulários)
│   ├── env.ts              # Validação de variáveis de ambiente
│   └── utils.ts            # Funções utilitárias
└── types/
    └── index.ts            # Tipos TypeScript
```

---

## Adicionando um novo projeto (sem admin)

1. Abra o Prisma Studio: `npx prisma studio`
2. Faça upload das imagens no painel do Vercel Blob
3. Copie as URLs geradas
4. Crie um novo registro em `Projeto` com as URLs

---

## Deploy na Vercel

1. Faça push do código para GitHub/GitLab
2. No painel da Vercel, importe o repositório
3. Em **Storage**, crie um banco Postgres e vincule ao projeto
4. Configure as variáveis de ambiente restantes (ver `.env.example`)
5. O script de build `prisma migrate deploy && next build` roda automaticamente

Domínio customizado: **Settings → Domains** no painel da Vercel.

---

## Migração de dados do Django

Se você tem dados no SQLite do Django:

```bash
# Instale dependências de dev extras
npm install -D better-sqlite3 @types/better-sqlite3 tsx

# Copie o db.sqlite3 para a raiz do projeto e rode:
npx tsx scripts/migrate-sqlite.ts
```

Depois, faça o upload manual das imagens para Vercel Blob / Cloudinary e atualize as URLs no Prisma Studio.

---

## Bug corrigido na migração

No template Django original (`projeto_detalhe.html`), os campos `localizacao`, `area` e `status` estavam **hardcoded** no HTML. Na versão Next.js, esses valores são lidos corretamente do banco de dados via o componente `TechSheet.tsx`.
