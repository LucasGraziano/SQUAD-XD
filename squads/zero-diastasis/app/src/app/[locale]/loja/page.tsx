import { getAllProducts } from '@/lib/upsell-engine';
import { ProductCard } from '@/components/upsell/product-card';
import { requireAuth } from '@/lib/auth';
import { Zap } from 'lucide-react';

export default async function StorePage() {
  await requireAuth();
  const products = getAllProducts();

  const essentials = products.filter((p) => ['pack-receitas', 'mantenimiento'].includes(p.id));
  const premium = products.filter((p) => ['aceleracion', 'reset-postural', 'comunidad', 'consulta-individual'].includes(p.id));

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Tienda</h1>
        <p className="text-foreground/50 text-sm">Productos complementarios para potenciar tus resultados</p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-5 border border-primary-100 mb-6 animate-slide-up">
        <div className="flex items-start gap-3">
          <Zap size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground text-sm">Resultados más rápidos</p>
            <p className="text-xs text-foreground/60 mt-0.5">Los productos complementarios aceleran tu recuperación en 2-3x según nuestras clientas.</p>
          </div>
        </div>
      </div>

      {/* Essentials */}
      <div className="mb-6 animate-slide-up-delay-1">
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-3">Esenciales</h2>
        <div className="space-y-3">
          {essentials.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Premium */}
      <div className="animate-slide-up-delay-2">
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-3">Programas completos</h2>
        <div className="space-y-3">
          {premium.map((p, i) => <ProductCard key={p.id} product={p} featured={i === 0} />)}
        </div>
      </div>
    </main>
  );
}
