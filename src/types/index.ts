import type { Projeto, Categoria, ImagemProjeto } from '@prisma/client'

/** Projeto com categoria incluída (usado na listagem) */
export type ProjetoComCategoria = Projeto & {
  categoria: Categoria
}

/** Projeto completo com galeria (usado na página de detalhe) */
export type ProjetoCompleto = Projeto & {
  categoria: Categoria
  imagens: ImagemProjeto[]
}

/** Re-exporta tipos base do Prisma para conveniência */
export type { Projeto, Categoria, ImagemProjeto }
