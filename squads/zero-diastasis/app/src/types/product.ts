export type Product = {
  id: string;
  name: string;
  descriptionKey: string;
  priceCents: number;
  currency: string;
  checkoutUrl: string;
  imageUrl?: string;
};

export type BonusConfig = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  unlockDay: number;
  format: 'pdf' | 'video' | 'audio';
  downloadPath: string;
  iconName: string;
};
