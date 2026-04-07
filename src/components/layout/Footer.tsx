export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <p>&copy; {year} Studio Côvado — Feito na medida do seu viver.</p>
    </footer>
  )
}
