import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'container-custom',
    'titulo-secao',
    'secao-padrao'
  ],
  theme: {
    extend: {
      colors: {
        bege: "#E5E0CF",
        areia: "#CDC6B6",
        oliva: "#796B57",
        carvalho: "#3E2929",
      },
      fontFamily: {
        titulos: ['var(--font-playfair)', 'serif'],
        textos: ['var(--font-host)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
