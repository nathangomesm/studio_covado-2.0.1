/**
 * scripts/migrate-sqlite.ts
 *
 * Migra dados do SQLite do Django para o Vercel Postgres via Prisma.
 *
 * COMO USAR:
 *   1. Copie o db.sqlite3 do projeto Django para a raiz deste projeto
 *   2. npm install -D better-sqlite3 @types/better-sqlite3 tsx
 *   3. npx tsx scripts/migrate-sqlite.ts
 *
 * ATENÇÃO: As imagens precisam ser re-uploaded manualmente para
 * Vercel Blob ou Cloudinary. Este script registra os nomes dos
 * arquivos originais para facilitar o processo.
 */

import Database from 'better-sqlite3'
import { PrismaClient } from '@prisma/client'
import path from 'path'

const sqlite = new Database(path.join(process.cwd(), 'db.sqlite3'))
const prisma = new PrismaClient()

interface SQLiteCategoria {
  id: number
  nome: string
}

interface SQLiteProjeto {
  id: number
  titulo: string
  descricao: string
  categoria_id: number
  imagem_principal: string
  data_publicacao: string
  ativo: number
  cliente: string
  localizacao: string
  area: string
  status: string
}

interface SQLiteImagem {
  id: number
  projeto_id: number
  imagem: string
}

async function main() {
  console.log('🚀 Iniciando migração SQLite → Vercel Postgres...\n')

  // ── 1. Categorias ────────────────────────────────────────────────────────
  const categorias = sqlite
    .prepare('SELECT * FROM portfolio_categoria ORDER BY id')
    .all() as SQLiteCategoria[]

  console.log(`📂 Migrando ${categorias.length} categorias...`)
  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { nome: cat.nome },
      create: { nome: cat.nome },
      update: {},
    })
    console.log(`   ✓ Categoria: ${cat.nome}`)
  }

  // ── 2. Projetos ──────────────────────────────────────────────────────────
  const projetos = sqlite
    .prepare('SELECT * FROM portfolio_projeto ORDER BY id')
    .all() as SQLiteProjeto[]

  console.log(`\n🏗️  Migrando ${projetos.length} projetos...`)
  console.log('   ⚠️  Imagens precisam ser re-uploaded para Vercel Blob / Cloudinary.')
  console.log('   Os nomes dos arquivos originais serão logados abaixo.\n')

  for (const p of projetos) {
    const categoriaNoNovoBanco = await prisma.categoria.findFirst({
      where: { nome: categorias.find((c) => c.id === p.categoria_id)?.nome },
    })

    if (!categoriaNoNovoBanco) {
      console.warn(`   ⚠️  Categoria não encontrada para projeto "${p.titulo}". Pulando.`)
      continue
    }

    // Placeholder — substitua pela URL real após upload
    const imagemUrl = `PENDENTE_UPLOAD: media/${p.imagem_principal}`

    await prisma.projeto.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        titulo: p.titulo,
        descricao: p.descricao,
        categoriaId: categoriaNoNovoBanco.id,
        imagemPrincipal: imagemUrl,
        dataPublicacao: new Date(p.data_publicacao),
        ativo: p.ativo === 1,
        cliente: p.cliente ?? 'Confidencial',
        localizacao: p.localizacao ?? 'A definir',
        area: p.area ?? 'A definir',
        status: p.status ?? 'Concluído',
      },
      update: {},
    })
    console.log(`   ✓ Projeto: "${p.titulo}"`)
    console.log(`     → Imagem original: media/${p.imagem_principal}`)
  }

  // ── 3. Imagens da Galeria ────────────────────────────────────────────────
  const imagens = sqlite
    .prepare('SELECT * FROM portfolio_imagemprojeto ORDER BY id')
    .all() as SQLiteImagem[]

  console.log(`\n🖼️  Migrando ${imagens.length} imagens de galeria...`)
  for (const img of imagens) {
    const imagemUrl = `PENDENTE_UPLOAD: media/${img.imagem}`
    await prisma.imagemProjeto.upsert({
      where: { id: img.id },
      create: {
        id: img.id,
        projetoId: img.projeto_id,
        imageUrl: imagemUrl,
      },
      update: {},
    })
    console.log(`   → Galeria: media/${img.imagem}`)
  }

  console.log('\n✅ Migração concluída!')
  console.log('\n📋 Próximo passo: faça upload de todas as imagens marcadas como')
  console.log('   "PENDENTE_UPLOAD" para o Vercel Blob ou Cloudinary e atualize')
  console.log('   as URLs no banco usando o Prisma Studio (npx prisma studio).\n')
}

main()
  .catch((e) => {
    console.error('❌ Erro na migração:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    sqlite.close()
  })
