import type { Product } from '@/types/product';

// Per briefing value ladder
const PRODUCTS: Product[] = [
  {
    id: 'pack-receitas',
    name: 'Pack de Recetas Anti-Inflamatorias',
    descriptionKey: '15-20 recetas simples que reducen la inflamación abdominal',
    priceCents: 400,
    currency: 'USD',
    checkoutUrl: '#',
  },
  {
    id: 'aceleracion',
    name: 'Aceleración',
    descriptionKey: 'Módulos extras para acelerar tus resultados — versión intensiva del protocolo',
    priceCents: 900,
    currency: 'USD',
    checkoutUrl: '#',
  },
  {
    id: 'reset-postural',
    name: 'Reset Postural Completo',
    descriptionKey: 'Programa complementario de postura + cadera + lumbar para resultados completos',
    priceCents: 2900,
    currency: 'USD',
    checkoutUrl: '#',
  },
  {
    id: 'mantenimiento',
    name: 'Plan de Mantenimiento Mensual',
    descriptionKey: 'Mantén tus resultados con sesiones semanales guiadas',
    priceCents: 990,
    currency: 'USD',
    checkoutUrl: '#',
  },
];

type ContextualUpsell = {
  product: Product;
  message: string;
};

// Per briefing: contextual upsells on specific milestone days
const CONTEXTUAL_UPSELLS: Record<number, { productId: string; message: string }> = {
  7: {
    productId: 'aceleracion',
    message: '¡Completaste la primera semana! ¿Quieres acelerar tus resultados?',
  },
  14: {
    productId: 'reset-postural',
    message: 'Tu postura afecta tu abdomen. Descubre el Reset Postural para resultados completos.',
  },
  21: {
    productId: 'aceleracion',
    message: '¿Lista para el siguiente nivel? El programa Aceleración lleva tus resultados más lejos.',
  },
  28: {
    productId: 'mantenimiento',
    message: '¡Felicidades por completar los 28 días! Mantén tus resultados con el plan mensual.',
  },
};

export function getContextualUpsell(dayNumber: number): ContextualUpsell | null {
  const config = CONTEXTUAL_UPSELLS[dayNumber];
  if (!config) return null;

  const product = PRODUCTS.find((p) => p.id === config.productId);
  if (!product) return null;

  return { product, message: config.message };
}

export function getRelevantUpsells(
  currentDay: number,
  purchasedProductIds: Set<string>,
): Product[] {
  return PRODUCTS.filter((p) => !purchasedProductIds.has(p.id)).slice(0, 3);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}
