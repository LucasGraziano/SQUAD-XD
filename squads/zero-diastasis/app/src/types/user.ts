import type { Profile, Purchase } from './database';

export type UserWithPurchases = Profile & {
  purchases: Purchase[];
};

export type AuthUser = {
  id: string;
  email: string;
};
