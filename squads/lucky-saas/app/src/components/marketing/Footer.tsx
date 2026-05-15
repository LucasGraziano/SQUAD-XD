import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10 py-10 px-5">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[6px] bg-[#0BD904] flex items-center justify-center">
              <span className="text-[#0D0D0D] text-[13px] font-black">P</span>
            </span>
            <span className="text-[15px] font-bold text-white tracking-tight">Premia</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="#features" className="text-[13px] text-[#6B7280] hover:text-white transition-colors">
              Funcionalidades
            </Link>
            <Link href="#pricing" className="text-[13px] text-[#6B7280] hover:text-white transition-colors">
              Preços
            </Link>
            <Link href="/login" className="text-[13px] text-[#6B7280] hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/signup" className="text-[13px] text-[#6B7280] hover:text-white transition-colors">
              Cadastrar
            </Link>
          </nav>

          {/* Legal */}
          <p className="text-[12px] text-[#6B7280] text-center md:text-right">
            © 2026 Premia.{' '}
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            {' '}· LGPD
          </p>
        </div>
      </div>
    </footer>
  )
}
