'use client'
import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

/**
 * Equivalente ao sistema de animação fade-in-section + animations.js do Django.
 * Usa IntersectionObserver para animar elementos ao entrar na viewport.
 */
export default function FadeInSection({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el) // anima só uma vez
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  )
}
