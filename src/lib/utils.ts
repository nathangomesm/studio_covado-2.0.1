import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Combina classes Tailwind sem conflito */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formata data para pt-BR */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(date))
}

/** Extrai apenas o ano de uma data */
export function getYear(date: Date): string {
  return new Date(date).getFullYear().toString()
}
