'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
        aria-expanded={open}
      >
        <span style={{ transform: open ? 'rotate(45deg) translate(5px, 5px)' : undefined }} />
        <span style={{ opacity: open ? 0 : 1 }} />
        <span style={{ transform: open ? 'rotate(-45deg) translate(5px, -5px)' : undefined }} />
      </button>

      {open && (
        <ul
          className="nav-links"
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            background: 'white',
            padding: '2rem',
            borderBottom: '1px solid var(--color-borda)',
            zIndex: 99,
          }}
        >
          {[
            { href: '/', label: 'Home' },
            { href: '/#sobre', label: 'Sobre nós' },
            { href: '/#projetos', label: 'Projetos' },
            { href: '/#contato', label: 'Contato' },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
