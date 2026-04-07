import Image from 'next/image'
import Link from 'next/link'
import MobileMenu from './MobileMenu'

export default function Header() {
  return (
    <header className="navbar">
      <div className="container nav-container">
        <div className="logo-container">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Studio Côvado"
              width={120}
              height={40}
              className="logo-img"
              priority
            />
          </Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#sobre">Sobre nós</Link></li>
            <li><Link href="/#projetos">Projetos</Link></li>
            <li><Link href="/#contato">Contato</Link></li>
          </ul>
          <MobileMenu />
        </nav>
      </div>
    </header>
  )
}
