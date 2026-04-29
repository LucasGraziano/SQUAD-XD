'use client';

import { WelcomeModal } from '@/components/onboarding/welcome-modal';
import { useWelcomeModal } from '@/hooks/use-welcome-modal';

export function WelcomeWrapper() {
  const { show, dismiss } = useWelcomeModal();
  if (!show) return null;
  return <WelcomeModal onClose={dismiss} />;
}
