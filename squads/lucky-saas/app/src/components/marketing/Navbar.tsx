'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-[0_1px_16px_rgba(0,0,0,0.06)] border-b border-transparent'
          : 'bg-white border-b border-[#E5E5E5]'
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-[6px] bg-[#0BD904] flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-[#0D0D0D] text-[13px] font-black">P</span>
          </span>
          <span className="text-[15px] font-bold text-[#0D0D0D] tracking-tight">Premia</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-[13px] text-[#6B7280] hover:text-[#0D0D0D] transition-colors">
            Funcionalidades
          </Link>
          <Link href="#how" className="text-[13px] text-[#6B7280] hover:text-[#0D0D0D] transition-colors">
            Como funciona
          </Link>
          <Link href="#pricing" className="text-[13px] text-[#6B7280] hover:text-[#0D0D0D] transition-colors">
            Preços
          </Link>
          <Link href="#faq" className="text-[13px] text-[#6B7280] hover:text-[#0D0D0D] transition-colors">
            FAQ
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="h-8 px-4 rounded-[6px] text-[13px] text-[#6B7280] font-medium hover:bg-[#F4F4F4] hover:text-[#0D0D0D] transition-colors flex items-center"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="h-8 px-4 rounded-[6px] border border-[#D1D1D1] bg-white text-[#0D0D0D] text-[13px] font-semibold hover:bg-[#F4F4F4] transition-colors flex items-center"
          >
            Começar grátis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-1.5 rounded-[6px] text-[#6B7280] hover:bg-[#F4F4F4] transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#E5E5E5] bg-white px-5 py-4 flex flex-col gap-3">
          {['#features', '#how', '#pricing', '#faq'].map((href, i) => (
            <Link
              key={href}
              href={href}
              className="text-[14px] text-[#6B7280]"
              onClick={() => setOpen(false)}
            >
              {['Funcionalidades', 'Como funciona', 'Preços', 'FAQ'][i]}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#E5E5E5]">
            <Link
              href="/login"
              className="h-9 flex items-center justify-center rounded-[6px] border border-[#D1D1D1] text-[13px] font-medium text-[#0D0D0D]"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="h-9 flex items-center justify-center rounded-[6px] bg-[#0BD904] text-[#0D0D0D] text-[13px] font-semibold"
              onClick={() => setOpen(false)}
            >
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
