import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { BottomNav } from '@/components/ui/bottom-nav';
import { AudioProvider } from '@/components/audio/audio-provider';
import { MiniPlayer } from '@/components/audio/mini-player';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as 'es' | 'pt')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AudioProvider>
        {children}
        <MiniPlayer />
        <BottomNav />
      </AudioProvider>
    </NextIntlClientProvider>
  );
}
