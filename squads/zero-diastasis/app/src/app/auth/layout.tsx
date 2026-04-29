import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary-50 items-center justify-center mb-4 text-2xl">
            🌸
          </div>
        </div>
        {children}
        <p className="text-center text-xs text-foreground/30 mt-8">
          Zero Diastasis™ · © 2026
        </p>
      </div>
    </div>
  );
}
