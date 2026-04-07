import Link from 'next/link'
import { getYear } from '@/lib/utils'
import type { Projeto } from '@/types'

interface Props {
  projeto: Projeto
}

export default function TechSheet({ projeto }: Props) {
  return (
    <div className="projeto-ficha">
      <h3>Ficha Técnica</h3>
      <ul className="lista-ficha">
        {/* BUG CORRIGIDO: o template Django original tinha esses valores hardcoded.
            Agora buscamos corretamente do banco de dados. */}
        <li>
          <strong>Cliente:</strong> {projeto.cliente}
        </li>
        <li>
          <strong>Ano:</strong> {getYear(projeto.dataPublicacao)}
        </li>
        <li>
          <strong>Localização:</strong> {projeto.localizacao}
        </li>
        <li>
          <strong>Área:</strong> {projeto.area}
        </li>
        <li>
          <strong>Status:</strong> {projeto.status}
        </li>
      </ul>
      <Link href="/" className="btn-voltar">
        ← Voltar para Projetos
      </Link>
    </div>
  )
}
