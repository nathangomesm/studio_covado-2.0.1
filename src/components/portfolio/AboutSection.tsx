import Image from 'next/image'
import FadeInSection from '@/components/ui/FadeInSection'

export default function AboutSection() {
  return (
    <section id="sobre" className="secao-padrao bg-areia">
      <div className="container sobre-container">
        <FadeInSection>
          <div className="sobre-texto">
            <h3 className="titulo-secao">Studio Côvado&copy;</h3>
            <p>
              Nossa história começou em 2019 com o desejo de criar uma arquitetura que
              refletisse a essência de cada cliente. Com mais de 230 projetos entregues
              pelo Brasil, evoluímos e demos origem ao <strong>Studio Côvado</strong>.
              Fundado e liderado por Jamylle Marcon na direção técnica e criativa, o
              estúdio une rigor construtivo e sensibilidade estética.
            </p>
            <p>
              Inspirado na antiga medida bíblica baseada no corpo humano, o
              &ldquo;côvado&rdquo; simboliza o encontro entre técnica e propósito. É a
              premissa de que criamos tudo, literalmente, na medida humana.
            </p>
            <p>
              Acreditamos que a excelência vai além do design visual: é um mergulho na
              sua rotina. Com um olhar de cuidado, transformamos lares em espaços
              funcionais, práticos e de estética atemporal, ressignificando o seu jeito
              de morar.
            </p>
            <p>
              <strong>Nós criamos o cenário onde a sua vida acontece.</strong>
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="sobre-imagem">
            <div className="moldura-imagem">
              {/*
                Substitua /sobre-equipe.jpg pela imagem real da equipe.
                Faça upload dela para a pasta /public do projeto.
              */}
              <Image
                src="/sobre-equipe.jpg"
                alt="Equipe Studio Côvado"
                width={600}
                height={750}
                className="object-cover"
                style={{ width: '100%', height: 'auto', aspectRatio: '4/5', objectFit: 'cover' }}
              />
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}
