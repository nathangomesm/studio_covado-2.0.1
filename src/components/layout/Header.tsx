"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="absolute w-full top-0 z-[1000] py-1 bg-areia shadow-sm">
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center z-[1001]">
          <Link href="/">
            {/* Lembre-se de colocar sua logo na pasta public/img/ com o nome Logo_2.png */}
            <img src="/img/Logo_2.png" alt="Studio Côvado" className="h-[100px] w-auto block" />
          </Link>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:block">
          <ul className="flex items-center list-none">
            {[
              { nome: "Home", link: "/" },
              { nome: "Sobre nós", link: "/#sobre" },    // <-- Barra adicionada aqui
              { nome: "Projetos", link: "/#projetos" },  // <-- Barra adicionada aqui
              { nome: "Contato", link: "/#contato" },    // <-- Barra adicionada aqui
            ].map((item, index, array) => (
              <li
                key={item.nome}
                className={`px-6 h-[1.1rem] flex items-center leading-none ${index !== array.length - 1 ? "border-r border-carvalho" : "pr-0"
                  }`}
              >
                <Link
                  href={item.link}
                  className="text-[0.85rem] uppercase tracking-[0.15em] font-normal relative group"
                >
                  {item.nome}
                  {/* Linha animada do hover */}
                  <span className="block w-0 h-[1px] bg-carvalho mt-[5px] transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botão Hambúrguer (Mobile) */}
        <div
          className="md:hidden flex flex-col gap-[5px] cursor-pointer z-[1001]"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <span className={`block w-[25px] h-[3px] bg-carvalho transition-all duration-300 ${menuAberto ? "rotate-45 translate-y-[8px]" : ""}`} />
          <span className={`block w-[25px] h-[3px] bg-carvalho transition-all duration-300 ${menuAberto ? "opacity-0" : ""}`} />
          <span className={`block w-[25px] h-[3px] bg-carvalho transition-all duration-300 ${menuAberto ? "-rotate-45 -translate-y-[8px]" : ""}`} />
        </div>

        {/* Menu Overlay (Mobile) */}
        <nav
          className={`fixed inset-0 w-full h-[100vh] bg-bege flex flex-col justify-center items-center gap-8 z-[1000] transition-opacity duration-300 md:hidden ${menuAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
          <ul className="flex flex-col items-center gap-6">
            {["Home", "Sobre nós", "Projetos", "Contato"].map((item) => (
              <li key={item} onClick={() => setMenuAberto(false)}>
                <Link
                  href={item === "Home" ? "/" : `#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-xl uppercase tracking-[0.15em] text-carvalho"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}