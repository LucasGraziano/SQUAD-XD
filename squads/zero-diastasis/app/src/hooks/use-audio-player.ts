'use client';

import { useContext } from 'react';
import { AudioContext, type AudioContextType } from '@/components/audio/audio-provider';

export function useAudioPlayer(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioProvider');
  }
  return context;
}
