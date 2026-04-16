export default function AboutSection() {
  return (
    <section id="sobre" className="secao-padrao bg-fixed bg-center bg-cover relative"
      style={{
  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/img/logo-fundo2.png')"
}}>
      <div className="container-custom grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 md:gap-24 items-center relative z-10 text-bege">
        {/* Coluna do Texto */}
        <div className="animate-fade-in">
          <h3 className="titulo-secao !text-[#CDC6B6]">Studio Côvado</h3>
          <div className="space-y-6 text-[1.05rem] text-[#CDC6B6] text-left">
            <p>Nossa história começou em 2019 com o desejo de criar uma arquitetura que refletisse a essência de cada cliente. Com mais de 230 projetos entregues pelo Brasil, evoluímos e demos origem ao <strong>Studio Côvado</strong>. Fundado e liderado por Jamylle Marcon na direção técnica e criativa, o estúdio une rigor construtivo e sensibilidade estética.</p>
            <p>Inspirado na antiga medida bíblica baseada no corpo humano, o &quot;côvado&quot; simboliza o encontro entre técnica e propósito. É a premissa de que criamos tudo, literalmente, na medida humana.</p>
            <p>Acreditamos que a excelência vai além do design visual: é um mergulho na sua rotina. Com um olhar de cuidado, transformamos lares em espaços funcionais, práticos e de estética atemporal, ressignificando o seu jeito de morar.</p>
            <p className="font-bold text-[#CDC6B6]">Nós criamos o cenário onde a sua vida acontece.</p>
          </div>
        </div>

        {/* Coluna da Imagem */}
        <div className="animate-fade-in">
          <div className="h-[400px] bg-[#E5E0CF] relative overflow-hidden">
            {/* O Next.js acusou erro 404 nessa imagem antes. Garanta que ela está na pasta public/ */}
            <img
              src="/img/sobre-equipe.jpg"
              alt="Equipe Studio Côvado"
              className="w-full h-full object-cover block transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}