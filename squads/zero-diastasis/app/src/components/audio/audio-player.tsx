'use client';

import { useAudioPlayer } from '@/hooks/use-audio-player';
import { PlayerControls } from './player-controls';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type AudioPlayerProps = {
  src: string;
  title: string;
  dayNumber: number;
};

export function AudioPlayer({ src, title, dayNumber }: AudioPlayerProps) {
  const { state, play, toggle, seek } = useAudioPlayer();
  const isThisTrack = state.src === src;
  const isPlaying = isThisTrack && state.isPlaying;

  function handleToggle() {
    if (isThisTrack) {
      toggle();
    } else {
      play(src, title, dayNumber);
    }
  }

  const currentTime = isThisTrack ? state.currentTime : 0;
  const duration = isThisTrack ? state.duration : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200">
      <h3 className="text-lg font-heading font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-foreground/50 mb-6">Día {dayNumber}</p>

      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full h-2 bg-secondary-200 rounded-full appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between mt-1 text-xs text-foreground/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        onToggle={handleToggle}
        onSeekBack={() => seek(Math.max(0, currentTime - 15))}
        onSeekForward={() => seek(Math.min(duration, currentTime + 15))}
      />
    </div>
  );
}
