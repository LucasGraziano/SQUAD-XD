'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Shield,
  Bell,
  DollarSign,
  BarChart3,
  FileText,
  Users,
  Settings,
  AlertCircle,
  Scale,
  CalendarDays,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/pipeline',
    icon: TrendingUp,
    label: 'Pipeline',
  },
  {
    href: '/apolices',
    icon: Shield,
    label: 'Apólices',
  },
  {
    href: '/propostas',
    icon: ClipboardList,
    label: 'Propostas',
  },
  {
    href: '/cotacoes',
    icon: Scale,
    label: 'Cotações',
  },
  {
    href: '/agenda',
    icon: CalendarDays,
    label: 'Agenda',
  },
  { divider: true },
  {
    href: '/alertas',
    icon: Bell,
    label: 'Alertas',
    badge: true,
  },
  {
    href: '/sinistros',
    icon: AlertCircle,
    label: 'Sinistros',
  },
  {
    href: '/financeiro',
    icon: DollarSign,
    label: 'Financeiro',
  },
  {
    href: '/relatorios',
    icon: BarChart3,
    label: 'Relatórios',
  },
  { divider: true },
  {
    href: '/documentos',
    icon: FileText,
    label: 'Documentos',
  },
  {
    href: '/clientes',
    icon: Users,
    label: 'Clientes',
  },
] as const

interface NavItem {
  href: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ElementType<any>
  label: string
  badge?: boolean
}

function NavLink({ item, pathname, showBadge, badgeCount }: { item: NavItem; pathname: string; showBadge?: boolean; badgeCount?: number }) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-2.5 px-4 py-2.5 rounded-[6px]',
        'text-[14px] font-medium transition-all duration-120',
        isActive
          ? 'bg-[rgba(11,217,4,0.08)] text-[#F0F2DF]'
          : 'text-[#8B8C81] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F0F2DF]'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0BD904] rounded-r-[2px]" />
      )}
      <item.icon
        className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-[#0BD904]' : '')}
        strokeWidth={1.5}
      />
      <span className="flex-1">{item.label}</span>
      {item.badge && showBadge && !badgeCount && (
        <span className="h-2 w-2 rounded-full bg-[#0BD904] flex-shrink-0" />
      )}
      {badgeCount && badgeCount > 0 ? (
        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : null}
    </Link>
  )
}

const PLAN_LABELS: Record<string, string> = {
  starter: 'Solo',
  pro: 'Pro',
  broker: 'Equipe',
}

interface SidebarProps {
  brokerName?: string
  brokerPlan?: string
  pendingAlertsCount?: number
  expiringPoliciesCount?: number
  overduePendenciesCount?: number
}

export function Sidebar({ brokerName, brokerPlan, pendingAlertsCount = 0, expiringPoliciesCount = 0, overduePendenciesCount = 0 }: SidebarProps) {
  const pathname = usePathname()
  const initial = brokerName ? brokerName[0].toUpperCase() : 'C'
  const displayName = brokerName || 'Corretor'
  const planLabel = (brokerPlan && PLAN_LABELS[brokerPlan]) ?? (brokerPlan || 'Pro')

  return (
    <aside className="sidebar-scroll fixed left-0 top-0 h-screen w-[240px] flex flex-col overflow-y-auto bg-[#0D0D0D] border-r border-[#1A1A1A] z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#1A1A1A]">
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0"
        >
          <path
            d="M10 2C8 2 6.5 3.5 6.5 5.5C6.5 7.5 8 9 10 9C12 9 13.5 7.5 13.5 5.5C13.5 3.5 12 2 10 2Z"
            fill="#0BD904"
          />
          <path
            d="M4 7C2 7 0.5 8.5 0.5 10.5C0.5 12.5 2 14 4 14C6 14 7.5 12.5 7.5 10.5C7.5 8.5 6 7 4 7Z"
            fill="#0BD904" opacity="0.7"
          />
          <path
            d="M16 7C14 7 12.5 8.5 12.5 10.5C12.5 12.5 14 14 16 14C18 14 19.5 12.5 19.5 10.5C19.5 8.5 18 7 16 7Z"
            fill="#0BD904" opacity="0.7"
          />
          <path
            d="M10 12C8 12 6.5 13.5 6.5 15.5C6.5 17.5 8 19 10 19C12 19 13.5 17.5 13.5 15.5C13.5 13.5 12 12 10 12Z"
            fill="#0BD904" opacity="0.5"
          />
        </svg>
        <span className="font-display text-[16px] font-bold text-white tracking-tight">
          Premia
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV_ITEMS.map((item, i) => {
          if ('divider' in item) {
            return <div key={`divider-${i}`} className="my-2 border-t border-[#1A1A1A]" />
          }
          const isApolices = item.href === '/apolices'
          const isAlertas = 'badge' in item && item.badge
          const isPropostas = item.href === '/propostas'
          return (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              showBadge={isAlertas ? pendingAlertsCount > 0 : false}
              badgeCount={
                isApolices && expiringPoliciesCount > 0 ? expiringPoliciesCount :
                isPropostas && overduePendenciesCount > 0 ? overduePendenciesCount :
                undefined
              }
            />
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1A1A1A] p-4">
        <Link
          href="/configuracoes"
          className={cn(
            'flex items-center gap-2.5 px-2 py-2 rounded-[6px]',
            'text-[13px] font-medium text-[#8B8C81]',
            'hover:bg-[rgba(255,255,255,0.04)] hover:text-[#F0F2DF] transition-colors duration-120'
          )}
        >
          <Settings className="h-4 w-4" strokeWidth={1.5} />
          <span>Configurações</span>
        </Link>
        <div className="mt-2 flex items-center gap-2.5 px-2 py-2">
          <div className="h-7 w-7 rounded-full bg-[#0BD904] flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-[#0D0D0D]">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-[#F0F2DF] truncate">{displayName}</p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[rgba(11,217,4,0.15)] text-[#0BD904]">
              {planLabel}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
