'use client';

import { useTranslations } from 'next-intl';
import { Home, Music, Gift, TrendingUp, User } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/' as const, icon: Home, labelKey: 'home' },
  { href: '/protocolo' as const, icon: Music, labelKey: 'protocol' },
  { href: '/bonus' as const, icon: Gift, labelKey: 'bonus' },
  { href: '/evolucao' as const, icon: TrendingUp, labelKey: 'progress' },
  { href: '/perfil' as const, icon: User, labelKey: 'profile' },
] as const;

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-secondary-200 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center min-w-touch min-h-touch gap-0.5 transition-colors',
                isActive ? 'text-primary' : 'text-foreground/40 hover:text-foreground/60',
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
