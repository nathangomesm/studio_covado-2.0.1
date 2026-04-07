import FadeInSection from '@/components/ui/FadeInSection'

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-content">
        <FadeInSection>
          <h2 className="frase-efeito">
            Feito na medida
            <br />
            do seu viver.
          </h2>
          <p className="subtitulo-hero">Nós criamos o cenário onde a sua vida acontece.</p>
        </FadeInSection>
      </div>
    </section>
  )
}
