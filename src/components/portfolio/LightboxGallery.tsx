"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

type LightboxGalleryProps = {
    titulo: string;
    imagemPrincipal: string;
    galeria: string[];
};

export default function LightboxGallery({ titulo, imagemPrincipal, galeria }: LightboxGalleryProps) {
    const todasAsFotos = [imagemPrincipal, ...(galeria || [])];

    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    const closeLightbox = () => setIsOpen(false);

    // Deixamos o evento (e) opcional para funcionar tanto com clique quanto com teclado
    const nextImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === todasAsFotos.length - 1 ? 0 : prev + 1));
    };

    const prevImage = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? todasAsFotos.length - 1 : prev - 1));
    };

    // ─── MÁGICA DO TECLADO AQUI ────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return; // Só escuta o teclado se a galeria estiver aberta

            if (e.key === "ArrowRight") nextImage();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "Escape") closeLightbox();
        };

        // Adiciona o "ouvido" quando o componente carrega
        window.addEventListener("keydown", handleKeyDown);

        // Remove o "ouvido" quando a tela fecha (evita travar o navegador)
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, todasAsFotos.length]);
    // ──────────────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Mosaico de Miniaturas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {todasAsFotos.map((url, index) => (
                    <div
                    
                        key={index}
                        className="h-[400px] relative overflow-hidden group cursor-pointer"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={url}
                            alt={`Galeria ${titulo} - ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            {/* TELA ESCURA DO CARROSSEL */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12"
                    onClick={closeLightbox}
                >
                    {/* Botão Fechar */}
                    <button className="absolute top-6 right-8 text-white text-4xl hover:text-gray-300 z-50">
                        &times;
                    </button>

                    {/* Botão Voltar */}
                    <button
                        className="absolute left-4 md:left-12 text-white text-5xl hover:text-gray-300 p-4 z-50"
                        onClick={prevImage}
                    >
                        &#10094;
                    </button>

                    {/* Imagem Grande (Otimizada com Next Image) */}
                    <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center justify-center">
                        <Image
                            src={todasAsFotos[currentIndex]}
                            alt={`Galeria ${titulo}`}
                            fill
                            sizes="100vw"
                            className="object-contain select-none"
                        />
                    </div>

                    {/* Botão Avançar */}
                    <button
                        className="absolute right-4 md:right-12 text-white text-5xl hover:text-gray-300 p-4 z-50"
                        onClick={nextImage}
                    >
                        &#10095;
                    </button>
                </div>
            )}
        </>
    );
}