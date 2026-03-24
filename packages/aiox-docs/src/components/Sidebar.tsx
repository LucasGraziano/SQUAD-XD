'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const nav = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Home', icon: '⚡' },
      { href: '/constitution/', label: 'Constitution', icon: '📜' },
    ],
  },
  {
    label: 'AIOX Core',
    items: [
      { href: '/aiox/', label: 'Core Agents', icon: '🤖' },
      { href: '/workflows/', label: 'Workflows', icon: '🔄' },
      { href: '/commands/', label: 'Commands', icon: '⌨️' },
    ],
  },
  {
    label: 'Squads',
    items: [
      { href: '/squads/', label: 'Low-Ticket Squad', icon: '🎖️' },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { href: '/mega-brain/', label: 'Mega Brain', icon: '🧠' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { href: '/search/', label: 'Quick Search', icon: '🔎' },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`fixed left-0 top-0 h-screen ${collapsed ? 'w-16' : 'w-64'} bg-surface-800 border-r border-surface-600 overflow-y-auto z-50 transition-all duration-300`}>
      <div className={collapsed ? 'p-3' : 'p-6'}>
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-gold flex items-center justify-center text-sm font-bold text-white shrink-0">
              A
            </div>
            {!collapsed && (
              <div>
                <div className="font-bold text-sm text-text-primary tracking-wide">AIOX</div>
                <div className="text-[10px] text-text-muted uppercase tracking-widest">Documentation</div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-text-muted hover:text-text-primary text-xs p-1"
          >
            {collapsed ? '>' : '<'}
          </button>
        </div>

        <nav className="space-y-6">
          {nav.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="text-[10px] uppercase tracking-widest text-text-muted mb-2 px-3">
                  {section.label}
                </div>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname === item.href.slice(0, -1)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          isActive
                            ? 'bg-surface-600 text-coral font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-700'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <span className="text-xs shrink-0">{item.icon}</span>
                        {!collapsed && item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-600 bg-surface-800">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-menta status-dot shrink-0" />
          {!collapsed && <span>Synkra AIOX v3.0</span>}
        </div>
      </div>
    </aside>
  )
}
