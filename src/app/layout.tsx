import "./globals.css";
import type { Metadata } from "next";
import { Nata_Sans, Host_Grotesk } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";


// Configuração das fontes
const nataSans = Nata_Sans({
  subsets: ['latin'],
  variable: '--font-nata',
  display: 'swap',
})

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: '--font-host',
  weight: ['300', '400', '700']
});

export const metadata: Metadata = {
  title: "Studio Côvado",
  description: "Feito na medida do seu viver.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${nataSans.variable} ${hostGrotesk.variable} font-textos bg-bege text-carvalho font-light tracking-wide`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}