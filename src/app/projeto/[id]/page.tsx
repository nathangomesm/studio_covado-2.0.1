import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import LightboxGallery from "@/components/portfolio/LightboxGallery";

// ── Tipagens ──────────────────────────────────────────────────────────────────
type Props = {
  params: Promise<{ id: string }>;
};

// ── Metadados dinâmicos para SEO ──────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // CORREÇÃO: Usando 'await' para desempacotar o params no Next.js 15+
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) return { title: "Projeto não encontrado" };

  const projeto = await prisma.projeto.findUnique({
    where: { id },
  });

  if (!projeto) return { title: "Projeto não encontrado" };

  return {
    title: `${projeto.titulo} | Studio Côvado`,
    description: projeto.descricao,
  };
}

// ── Página ────────────────────────────────────────────────────────────────────
export default async function ProjetoDetalhePage({ params }: Props) {
  // CORREÇÃO: Usando 'await' para desempacotar o params no Next.js 15+
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) notFound();

  // Buscando o projeto no banco de dados e incluindo a categoria atrelada a ele
  const projeto = await prisma.projeto.findUnique({
    where: { id },
    include: {
      categoria: true,
      // Se você tiver uma tabela separada de 'Imagens' relacionada ao projeto, inclua aqui.
      // ex: imagensGaleria: true
    },
  });

  if (!projeto) notFound();

  return (
    <div>
      {/* Hero Específico do Projeto */}
      <section
        className="h-[70vh] bg-cover bg-center relative flex items-end pb-16"
        style={{ backgroundImage: `url('${projeto.imagemPrincipal}')` }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="container-custom relative z-10 text-white animate-fade-in">
          <p className="uppercase tracking-[0.2em] text-[0.9rem] mb-4 opacity-90 font-textos">
            {projeto.categoria?.nome || "Projeto"}
          </p>
          <h1 className="text-[3.5rem] font-titulos leading-tight">
            {projeto.titulo}
          </h1>
        </div>
      </section>

      {/* Layout Ficha Técnica + Texto */}
      <section className="secao-padrao">
        <div className="container-custom grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16">

          {/* Ficha Técnica (Coluna da Esquerda) */}
          <div className="animate-fade-in">
            <h3 className="text-[1.5rem] font-titulos mb-6 text-carvalho border-b border-oliva pb-4 inline-block">
              Ficha Técnica
            </h3>
            <ul className="space-y-4 text-[0.95rem] text-[#555] font-textos">
              <li className="border-b border-[#eee] pb-2">
                <strong className="text-carvalho font-normal">Localização:</strong> {projeto.localizacao || "-"}
              </li>
              <li className="border-b border-[#eee] pb-2">
                <strong className="text-carvalho font-normal">Área:</strong> {projeto.area || "-"}
              </li>
            </ul>

            <Link
              href="/#projetos"
              className="inline-block mt-12 text-[1.2rem] font-bold uppercase text-oliva hover:text-carvalho transition-all hover:-ml-1"
            >
              ← Voltar para Projetos
            </Link>
          </div>

          {/* Texto do Projeto (Coluna da Direita) */}
          <div className="animate-fade-in">
            <h3 className="text-[1.5rem] font-titulos mb-6 text-carvalho border-b border-oliva pb-4 inline-block">
              Sobre o Projeto
            </h3>
            <div className="text-[1.1rem] leading-[1.9] text-[#444] font-textos whitespace-pre-wrap">
              {projeto.descricao}
            </div>
          </div>

        </div>
      </section>

      {/* Galeria de Fotos Interativa */}
      <section className="secao-padrao bg-areia">
        <div className="container-custom">
          <h3 className="titulo-secao !text-[#3E2929] -mt-6">Imagens do projeto</h3>

          <LightboxGallery
            titulo={projeto.titulo}
            imagemPrincipal={projeto.imagemPrincipal}
            galeria={projeto.galeria}
          />

        </div>
      </section>
    </div>
  );
}