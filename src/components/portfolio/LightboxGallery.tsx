"use client";

import { useState } from "react";
import Image from "next/image";
// Importações da biblioteca mágica
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface Props {
    titulo: string;
    imagemPrincipal: string;
    galeria: string[]; // Supondo que a galeria venha como um array de links das imagens
}

export default function LightboxGallery({ titulo, imagemPrincipal, galeria }: Props) {
    const [indexAberto, setIndexAberto] = useState(-1);

    // Junta a imagem principal com as outras da galeria para o cliente poder passar pro lado
    const todasAsImagens = [imagemPrincipal, ...(galeria || [])];

    // A biblioteca precisa que as imagens tenham esse formato { src: "link" }
    const slides = todasAsImagens.map((img) => ({ src: img }));

    return (
        <>
            {/* O GRID DAS FOTOS PEQUENAS NA TELA (Onde ajustamos o tamanho hoje mais cedo) 
      */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                {todasAsImagens.map((img, index) => (
                    <div
                        key={index}
                        className="aspect-[4/3] relative overflow-hidden cursor-pointer group"
                        onClick={() => setIndexAberto(index)}
                    >
                        <Image
                            src={img}
                            alt={`${titulo} - Imagem ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Efeito escuro de hover para indicar que pode clicar */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                ))}
            </div>

            {/* A MÁGICA DA TELA CHEIA (LIGHTBOX COM ZOOM)
      */}
            <Lightbox
                open={indexAberto >= 0}
                close={() => setIndexAberto(-1)}
                index={indexAberto}
                slides={slides}
                plugins={[Zoom]} // Ativando o super poder de zoom!
                zoom={{
                    maxZoomPixelRatio: 3, // Permite dar zoom de até 3x o tamanho original
                    zoomInMultiplier: 2, // Velocidade do zoom no clique
                }}
                render={{
                    // Desativa botões desnecessários para um design mais limpo e minimalista
                    buttonPrev: slides.length <= 1 ? () => null : undefined,
                    buttonNext: slides.length <= 1 ? () => null : undefined,
                }}
            />
        </>
    );
}