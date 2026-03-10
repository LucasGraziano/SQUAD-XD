import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'pt'] as const,
  defaultLocale: 'es',
});
