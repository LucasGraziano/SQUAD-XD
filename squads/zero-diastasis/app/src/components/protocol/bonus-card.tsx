'use client';

import { Lock, Download, Sparkles, BookOpen, Zap, Calendar, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { BonusConfig } from '@/types/product';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Zap,
  Calendar,
};

type BonusCardProps = {
  bonus: BonusConfig;
  status: 'locked' | 'unlocked' | 'new';
  onDownload?: () => void;
};

export function BonusCard({ bonus, status, onDownload }: BonusCardProps) {
  const Icon = iconMap[bonus.iconName] || BookOpen;

  return (
    <Card className={status === 'locked' ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            status === 'locked' ? 'bg-gray-100' :
            status === 'new' ? 'bg-accent-50' :
            'bg-primary-50'
          }`}>
            {status === 'locked' ? (
              <Lock size={20} className="text-gray-400" />
            ) : (
              <Icon size={20} className={status === 'new' ? 'text-accent' : 'text-primary'} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-bold text-foreground">{bonus.titleKey}</h3>
              {status === 'new' && (
                <Badge variant="new">
                  <Sparkles size={10} className="mr-1" />
                  Nuevo
                </Badge>
              )}
            </div>
            <p className="text-sm text-foreground/60 mb-3">{bonus.descriptionKey}</p>

            {status === 'locked' ? (
              <p className="text-xs text-foreground/40">Se desbloquea el día {bonus.unlockDay}</p>
            ) : (
              <Button size="sm" variant={status === 'new' ? 'accent' : 'secondary'} className="gap-1.5" onClick={onDownload}>
                <Download size={14} />
                Descargar {bonus.format.toUpperCase()}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
