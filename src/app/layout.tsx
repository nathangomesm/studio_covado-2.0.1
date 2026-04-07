import type { Metadata } from 'next'
import { Host_Grotesk, Playfair_Display } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import './globals.css'

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-host-grotesk',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://studiocovado.com.br'),
  title: {
    template: 'Studio Côvado | %s',
    default: 'Studio Côvado — Arquitetura e Interiores',
  },
  description:
    'Feito na medida do seu viver. Arquitetura e interiores em Lages, SC. Mais de 230 projetos entregues pelo Brasil.',
  keywords: ['arquitetura', 'interiores', 'design', 'Lages', 'SC', 'Studio Côvado'],
  authors: [{ name: 'Studio Côvado' }],
  openGraph: {
    title: 'Studio Côvado — Arquitetura e Interiores',
    description: 'Feito na medida do seu viver.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Studio Côvado' }],
    locale: 'pt_BR',
    type: 'website',
    siteName: 'Studio Côvado',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Côvado',
    description: 'Feito na medida do seu viver.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  return (
    <html lang="pt-BR" className={`${hostGrotesk.variable} ${playfair.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {whatsappNumber && <WhatsAppButton phoneNumber={whatsappNumber} />}
      </body>
    </html>
  )
}
