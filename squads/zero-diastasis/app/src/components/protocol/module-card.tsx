'use client';

import { Clock, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ProtocolModule } from '@/types/protocol';

type ModuleCardProps = {
  module: ProtocolModule;
  isUnlocked: boolean;
  completedCount: number;
  totalDays: number;
};

export function ModuleCard({ module, isUnlocked, completedCount, totalDays }: ModuleCardProps) {
  return (
    <Card className={!isUnlocked ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={isUnlocked ? 'accent' : 'locked'}>
            Módulo {module.id}
          </Badge>
          {!isUnlocked && <Lock size={16} className="text-gray-400" />}
        </div>
        <h3 className="font-heading font-bold text-foreground mb-1">{module.titleKey}</h3>
        <p className="text-sm text-foreground/60 mb-2">{module.descriptionKey}</p>
        <div className="flex items-center gap-3 text-xs text-foreground/40">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {module.audioDuration}
          </span>
          <span>{completedCount}/{totalDays} días</span>
        </div>
      </CardContent>
    </Card>
  );
}
