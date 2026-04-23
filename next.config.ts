import type { NextConfig } from 'next'

// Verifica se está rodando no seu computador ou na Vercel
const isDev = process.env.NODE_ENV !== 'production'

// Aplica o 'unsafe-eval' apenas no seu computador para permitir o reload da tela
const scriptSrc = isDev 
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net"
  : "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net"

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc, // <--- Regra inteligente aplicada aqui
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.resend.com",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Cloudinary (substitua SEU_CLOUD_NAME pelo nome real)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/SEU_CLOUD_NAME/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig