"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Tipagens para o TypeScript não reclamar dos dados que vêm do banco
type Categoria = {
  id: string; // ou number, dependendo do seu schema.prisma
  nome: string;
};

type Projeto = {
  id: string; // ou number
  titulo: string;
  imagemPrincipal: string;
  categoriaId: string; // ou number
  categoria?: Categoria;
};

interface ProjectGalleryProps {
  projetos: Projeto[];
  categorias: Categoria[];
}

export default function ProjectGallery({ projetos, categorias }: ProjectGalleryProps) {
  // Estado para controlar qual filtro está selecionado
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");

  // Lógica de filtragem
  const projetosFiltrados = filtroAtivo === "todos"
    ? projetos
    : projetos.filter((projeto) => projeto.categoriaId === filtroAtivo);

  return (
    <section id="projetos" className="secao-padrao bg-areia">
      <div className="container-custom">
        {/* Cabeçalho da Seção e Filtros */}
        <div className="mb-16 text-center animate-fade-in">
          <h3 className="titulo-secao !text-[#3E2929]">
            NOSSOS PROJETOS
          </h3>

          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <button
              onClick={() => setFiltroAtivo("todos")}
              className={`bg-transparent border-none font-textos text-[1rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 pb-[5px] border-b ${filtroAtivo === "todos"
                  ? "opacity-100 text-carvalho border-carvalho"
                  : "opacity-60 text-oliva border-transparent hover:opacity-100 hover:text-carvalho hover:border-carvalho"
                }`}
            >
              Todos
            </button>

            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFiltroAtivo(cat.id)}
                className={`bg-transparent border-none font-textos text-[1rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 pb-[5px] border-b ${filtroAtivo === cat.id
                    ? "opacity-100 text-carvalho border-carvalho"
                    : "opacity-60 text-oliva border-transparent hover:opacity-100 hover:text-carvalho hover:border-carvalho"
                  }`}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Projetos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-4 md:gap-x-6 mt-10">
          {projetosFiltrados.length > 0 ? (
            projetosFiltrados.map((projeto) => (
              <Link href={`/projeto/${projeto.id}`} key={projeto.id} className="block group animate-fade-in">
                <div className="bg-transparent cursor-pointer">
                  {/* Container da Imagem com os efeitos de Hover */}
                  <div className="aspect-[4/3] overflow-hidden mb-6 relative">
                    <Image
                      src={projeto.imagemPrincipal}
                      alt={projeto.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale-[20%] transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  </div>
                  {/* Informações do Card */}
                  <div>
                    <h4 className="text-[1.5rem] mb-1 text-carvalho font-titulos">{projeto.titulo}</h4>
                    <p className="text-[0.8rem] uppercase tracking-[0.1em] text-oliva font-textos">
                      {projeto.categoria?.nome || "Projeto"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-full text-oliva mt-8">Em breve novos projetos.</p>
          )}
        </div>
      </div>
    </section>
  );
}