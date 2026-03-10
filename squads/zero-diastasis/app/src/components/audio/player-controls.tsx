'use client';

import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

type PlayerControlsProps = {
  isPlaying: boolean;
  onToggle: () => void;
  onSeekBack: () => void;
  onSeekForward: () => void;
};

export function PlayerControls({ isPlaying, onToggle, onSeekBack, onSeekForward }: PlayerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button onClick={onSeekBack} className="p-2 text-foreground/60 hover:text-foreground transition-colors" aria-label="Retroceder 15s">
        <SkipBack size={24} />
      </button>
      <button
        onClick={onToggle}
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-500 transition-colors"
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
      </button>
      <button onClick={onSeekForward} className="p-2 text-foreground/60 hover:text-foreground transition-colors" aria-label="Avanzar 15s">
        <SkipForward size={24} />
      </button>
    </div>
  );
}
