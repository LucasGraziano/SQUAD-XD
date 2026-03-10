'use client';

import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product';

type ContextualOfferProps = {
  product: Product;
  message: string;
};

export function ContextualOffer({ product, message }: ContextualOfferProps) {
  const price = (product.priceCents / 100).toFixed(2);

  return (
    <Card className="bg-gradient-to-br from-accent-50 to-primary-50 border-accent/20">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <Sparkles size={18} className="text-accent mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/70 italic">{message}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-bold text-foreground">{product.name}</h4>
            <span className="text-accent font-bold">${price}</span>
          </div>
          <a href={product.checkoutUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="accent">Quiero esto</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
