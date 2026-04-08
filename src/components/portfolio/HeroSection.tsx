export default function HeroSection() {
  return (
    <section
      className="h-screen flex items-center justify-center text-center relative bg-fixed bg-center bg-no-repeat bg-cover"
      style={{
        /* Lembre-se de colocar a foto na pasta public/img/ */
        backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/img/page_principal_aspen.jpeg')",
      }}
    >
      <div className="relative z-10 container-custom animate-fade-in">
        <h2 className="font-titulos text-[clamp(3rem,6vw,5.5rem)] text-white tracking-[-0.03em] mb-8 drop-shadow-md leading-[1.2]">
          Feito na medida<br />do seu viver.
        </h2>
        
        <p className="font-textos text-base uppercase tracking-[0.3em] text-bege mt-4 border-t border-bege pt-6 inline-block">
          Nós criamos o cenário onde a sua vida acontece.
        </p>
      </div>
    </section>
  );
}