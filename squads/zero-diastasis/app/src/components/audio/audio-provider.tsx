'use client';

import { createContext, useCallback, useRef, useState, type ReactNode } from 'react';

export type AudioState = {
  src: string | null;
  title: string;
  dayNumber: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};

export type AudioContextType = {
  state: AudioState;
  play: (src: string, title: string, dayNumber: number) => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  close: () => void;
};

const initialState: AudioState = {
  src: null,
  title: '',
  dayNumber: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

export const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>(initialState);

  const play = useCallback((src: string, title: string, dayNumber: number) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', () => {
        setState((prev) => ({
          ...prev,
          currentTime: audioRef.current?.currentTime || 0,
        }));
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setState((prev) => ({
          ...prev,
          duration: audioRef.current?.duration || 0,
        }));
      });
      audioRef.current.addEventListener('ended', () => {
        setState((prev) => ({ ...prev, isPlaying: false }));
      });
    }

    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
    }

    audioRef.current.play();
    setState({ src, title, dayNumber, isPlaying: true, currentTime: 0, duration: 0 });

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: 'Zero Diastasis™',
        album: `Día ${dayNumber}`,
      });
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (audioRef.current?.src) {
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [state.isPlaying, pause]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, currentTime: time }));
    }
  }, []);

  const close = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    setState(initialState);
  }, []);

  return (
    <AudioContext.Provider value={{ state, play, pause, toggle, seek, close }}>
      {children}
    </AudioContext.Provider>
  );
}
