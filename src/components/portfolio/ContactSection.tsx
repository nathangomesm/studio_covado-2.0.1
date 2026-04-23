export default function ContactSection() {
  return (
    <section
      id="contato"
      className="secao-padrao bg-fixed bg-center bg-cover relative py-32"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/img/logo-fundo2.png')"
      }}
    >
      {/* Container do texto que fica por cima da imagem */}
      <div className="container-custom text-center animate-fade-in relative z-10 text-bege flex flex-col items-center">

        <h3 className="titulo-secao !text-[#CDC6B6] font-titulos text-4xl md:text-5xl mb-2">
          Vamos conversar?
        </h3>

        <p className="text-[#CDC6B6] text-[1.05rem] font-textos mb-8 max-w-lg">
          Entre em contato para transformar seu sonho em projeto.
        </p>

        <a
          href="https://wa.me/554999999999" // Coloque o número do estúdio aqui
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-carvalho text-bege px-8 py-4 uppercase tracking-[0.1em] text-[0.8rem] hover:bg-oliva transition-colors duration-300 font-textos"
        >
          Iniciar Atendimento no WhatsApp
        </a>
      </div>
    </section>
  );
}