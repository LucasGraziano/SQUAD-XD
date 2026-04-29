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
import { PulseDot } from '@/components/ui/motion'

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
      className="w-60 min-h-screen bg-brand-teal flex flex-col"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <motion.span
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="font-serif text-xl text-white tracking-tight block"
        >
          Vínculo
        </motion.span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }, i) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <motion.div
              key={href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href={href}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-[200ms] ease-out
                  ${active
                    ? 'text-white'
                    : 'text-white/65 hover:text-white hover:bg-white/8'
                  }
                `}
              >
                {/* Active background */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-white/15"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    />
                  )}
                </AnimatePresence>

                {/* Active left border */}
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="sidebar-border"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-brand-sand"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <span className="relative">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <span className="relative">{label}</span>

                {badge != null && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                    className="relative ml-auto bg-semantic-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-badge"
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
        transition={{ delay: 0.55, duration: 0.4 }}
        className="px-3 py-4 border-t border-white/10 space-y-0.5"
      >
        <Link
          href="/planos"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/8 hover:text-white transition-all duration-[200ms]"
        >
          <Gem size={18} strokeWidth={1.5} />
          Plano
        </Link>
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/8 hover:text-white transition-all duration-[200ms]"
        >
          <Settings size={18} strokeWidth={1.5} />
          Configurações
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/65 hover:bg-white/8 hover:text-white transition-all duration-[200ms]"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Sair
        </button>
      </motion.div>
    </motion.aside>
  )
}
