import { getAllProducts } from '@/lib/upsell-engine';
import { ProductCard } from '@/components/upsell/product-card';
import { requireAuth } from '@/lib/auth';

export default async function StorePage() {
  await requireAuth();
  const products = getAllProducts();

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Tienda</h1>
      <p className="text-foreground/60 mb-6">Productos complementarios para tu bienestar</p>

      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
