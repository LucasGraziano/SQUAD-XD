'use client';

import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = (product.priceCents / 100).toFixed(2);

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-heading font-bold text-foreground text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-foreground/60 mb-3">{product.descriptionKey}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-accent">
            ${price} <span className="text-xs font-normal text-foreground/40">{product.currency}</span>
          </span>
          <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="accent" className="gap-1.5">
              Ver más
              <ExternalLink size={14} />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
