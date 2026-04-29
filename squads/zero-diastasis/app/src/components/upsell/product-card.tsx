import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

type ProductCardProps = {
  product: Product;
  featured?: boolean;
};

const PRODUCT_META: Record<string, { emoji: string; badge?: string; badgeColor?: string }> = {
  'pack-receitas': { emoji: '🥗', badge: 'Más vendido', badgeColor: 'bg-green-100 text-green-700' },
  'aceleracion': { emoji: '⚡', badge: 'Popular', badgeColor: 'bg-accent-100 text-accent-600' },
  'reset-postural': { emoji: '🧘' },
  'mantenimiento': { emoji: '🔄', badge: 'Recurrente', badgeColor: 'bg-blue-100 text-blue-700' },
  'comunidad': { emoji: '👥', badge: 'Comunidad', badgeColor: 'bg-purple-100 text-purple-700' },
  'consulta-individual': { emoji: '🎯', badge: 'Premium', badgeColor: 'bg-amber-100 text-amber-700' },
};

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const meta = PRODUCT_META[product.id] || { emoji: '✨' };
  const price = (product.priceCents / 100).toFixed(0);
  const isDisabled = product.checkoutUrl === '#';

  return (
    <div className={cn(
      'rounded-2xl border bg-white p-5 transition-all duration-200',
      featured ? 'border-primary-300 shadow-md shadow-primary/10' : 'border-secondary-200 hover:border-primary-200 hover:shadow-sm',
    )}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center text-2xl flex-shrink-0">
          {meta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-bold text-foreground leading-tight">{product.name}</h3>
            {meta.badge && (
              <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0', meta.badgeColor)}>
                {meta.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/60 mb-3 leading-relaxed">{product.descriptionKey}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-heading font-bold text-foreground">
              ${price} <span className="text-sm font-normal text-foreground/50">{product.currency}</span>
            </span>
            <a
              href={isDisabled ? undefined : product.checkoutUrl}
              target={isDisabled ? undefined : '_blank'}
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200',
                isDisabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-600 active:scale-95',
              )}
            >
              {isDisabled ? 'Próximo' : 'Comprar'}
              {!isDisabled && <ChevronRight size={14} />}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
