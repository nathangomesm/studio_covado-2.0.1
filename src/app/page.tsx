import { prisma } from "@/lib/prisma"; // Certifique-se de que este caminho aponta para a sua configuração do Prisma
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ContactSection from "@/components/portfolio/ContactSection";
import ProjectGallery from "@/components/portfolio/ProjectGallery";

export default async function HomePage() {
  // 1. Buscando os dados direto do banco de dados (Prisma)
  const [projetos, categorias] = await Promise.all([
    prisma.projeto.findMany({
      where: { ativo: true },
      include: { categoria: true }, // Inclui o nome da categoria junto com o projeto
      orderBy: { dataPublicacao: 'desc' }
    }),
    prisma.categoria.findMany({
      orderBy: { nome: 'asc' }
    })
  ]);

  // Convertendo ids e datas complexas para string simples se necessário 
  // (Evita erros de serialização ao passar do Server para o Client Component)
  const projetosFormatados = projetos.map(p => ({
    ...p,
    id: p.id.toString(),
    categoriaId: p.categoriaId.toString(),
    categoria: p.categoria ? { id: p.categoria.id.toString(), nome: p.categoria.nome } : undefined
  }));

  const categoriasFormatadas = categorias.map(c => ({
    ...c,
    id: c.id.toString()
  }));

  return (
    <div>
      <HeroSection />
      <AboutSection />
      
      {/* 2. Passando os dados do banco para o nosso componente visual */}
      <ProjectGallery 
        projetos={projetosFormatados} 
        categorias={categoriasFormatadas} 
      />
      
      <ContactSection />
    </div>
  );
}