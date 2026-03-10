'use client';

import { Play, Pause, X } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/use-audio-player';

export function MiniPlayer() {
  const { state, toggle, close } = useAudioPlayer();

  if (!state.src) return null;

  const progress = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-secondary-200 shadow-lg safe-area-pb">
      <div className="h-0.5 bg-secondary-200">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center gap-3 px-4 py-2.5 max-w-lg mx-auto">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0"
          aria-label={state.isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {state.isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{state.title}</p>
          <p className="text-xs text-foreground/40">Día {state.dayNumber}</p>
        </div>
        <button onClick={close} className="p-1.5 text-foreground/40 hover:text-foreground" aria-label="Cerrar">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
