'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  AlertTriangle,
  Brain,
  Settings,
  LogOut,
  Gem,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/pacientes',  label: 'Pacientes',  icon: Users,           badge: null },
  { href: '/agenda',     label: 'Agenda',     icon: Calendar,        badge: null },
  { href: '/prontuario', label: 'Prontuário', icon: FileText,        badge: null },
  { href: '/financeiro', label: 'Financeiro', icon: CreditCard,      badge: null },
  { href: '/alertas',    label: 'Alertas',    icon: AlertTriangle,   badge: 2 },
  { href: '/linhagem',   label: 'IA Linhagem',icon: Brain,           badge: null },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="w-60 min-h-screen bg-neutral-mist border-r border-neutral-border flex flex-col"
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b border-neutral-border">
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="font-serif text-xl text-brand-teal tracking-tight block"
        >
          Vínculo
        </motion.span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Navegação principal">
        {navItems.map(({ href, label, icon: Icon, badge }, i) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out
                  ${active
                    ? 'text-brand-teal bg-[#E8F3F6]'
                    : 'text-neutral-secondary hover:text-neutral-charcoal hover:bg-[#E8E8E6]'
                  }
                `}
              >
                {/* Active left indicator */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-brand-teal"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      exit={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </AnimatePresence>

                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{label}</span>

                {badge != null && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.45, duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="ml-auto bg-semantic-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-badge"
                    aria-label={`${badge} alertas`}
                  >
                    {badge}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="px-3 py-4 border-t border-neutral-border space-y-0.5"
      >
        <Link
          href="/planos"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-secondary hover:text-neutral-charcoal hover:bg-[#E8E8E6] transition-all duration-200"
        >
          <Gem size={18} strokeWidth={1.5} aria-hidden="true" />
          Plano
        </Link>
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-secondary hover:text-neutral-charcoal hover:bg-[#E8E8E6] transition-all duration-200"
        >
          <Settings size={18} strokeWidth={1.5} aria-hidden="true" />
          Configurações
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-secondary hover:text-neutral-charcoal hover:bg-[#E8E8E6] transition-all duration-200"
          aria-label="Sair da conta"
        >
          <LogOut size={18} strokeWidth={1.5} aria-hidden="true" />
          Sair
        </button>
      </motion.div>
    </motion.aside>
  )
}
