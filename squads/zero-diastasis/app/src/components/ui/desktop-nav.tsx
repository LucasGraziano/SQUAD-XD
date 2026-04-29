'use client';

import { Home, Music, CalendarDays, TrendingUp, User, ShoppingBag } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/' as const, icon: Home, label: 'Inicio' },
  { href: '/protocolo' as const, icon: Music, label: 'Protocolo' },
  { href: '/planner' as const, icon: CalendarDays, label: 'Planner' },
  { href: '/evolucao' as const, icon: TrendingUp, label: 'Evolución' },
  { href: '/loja' as const, icon: ShoppingBag, label: 'Tienda' },
  { href: '/perfil' as const, icon: User, label: 'Perfil' },
] as const;

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-secondary-100 px-4 py-8 fixed left-0 top-0 z-40">
      <div className="mb-8 px-2">
        <h1 className="font-heading font-black text-lg text-primary leading-tight">Zero<br />Diastasis™</h1>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary-50 text-primary font-semibold'
                  : 'text-foreground/50 hover:text-foreground hover:bg-secondary-50',
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 pt-4 border-t border-secondary-100">
        <p className="text-xs text-foreground/30">Zero Diastasis™ v1.0</p>
      </div>
    </aside>
  );
}
