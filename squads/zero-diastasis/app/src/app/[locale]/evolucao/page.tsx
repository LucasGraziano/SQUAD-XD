'use client';

import { useState } from 'react';
import { MeasurementForm } from '@/components/tracker/measurement-form';
import { PhotoUpload } from '@/components/tracker/photo-upload';
import { SymptomDiary } from '@/components/tracker/symptom-diary';
import { ProgressChart } from '@/components/tracker/progress-chart';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'measures', label: 'Medidas' },
  { id: 'photos', label: 'Fotos' },
  { id: 'symptoms', label: 'Síntomas' },
  { id: 'chart', label: 'Gráfico' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function EvolutionPage() {
  const [activeTab, setActiveTab] = useState<TabId>('measures');

  return (
    <main className="px-5 pt-8 pb-24 max-w-lg mx-auto">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Evolución</h1>

      <div className="flex gap-1 bg-secondary-100 rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 py-2 text-sm font-medium rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-white text-foreground shadow-sm'
                : 'text-foreground/50 hover:text-foreground/70',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'measures' && <MeasurementForm />}
      {activeTab === 'photos' && <PhotoUpload />}
      {activeTab === 'symptoms' && <SymptomDiary />}
      {activeTab === 'chart' && <ProgressChart />}
    </main>
  );
}
