import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-mist flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-serif text-8xl text-brand-teal/20 leading-none select-none mb-6">404</p>
        <h1 className="font-serif text-2xl text-neutral-charcoal mb-3">
          Página não encontrada
        </h1>
        <p className="text-neutral-secondary text-sm leading-relaxed mb-8">
          O endereço que você acessou não existe ou foi movido.
          Verifique o link ou volte ao início.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-medium px-5 py-2.5 rounded-input transition-colors"
        >
          <ArrowLeft size={15} />
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
