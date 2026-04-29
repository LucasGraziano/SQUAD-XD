'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

type YouTubeEmbedProps = {
  videoId: string;
  title?: string;
  aspectRatio?: '16/9' | '9/16';
};

export function YouTubeEmbed({ videoId, title = 'Video', aspectRatio = '16/9' }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const paddingBottom = aspectRatio === '9/16' ? '177.78%' : '56.25%';

  return (
    <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
      <div className="relative w-full" style={{ paddingBottom }}>
        {!loaded ? (
          // Lazy thumbnail — click to load iframe
          <button
            onClick={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 group"
            aria-label={`Reproducir: ${title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                <Play size={28} className="text-primary ml-1" fill="currentColor" />
              </div>
              <span className="text-white font-medium text-sm bg-black/40 px-3 py-1 rounded-full">
                {title}
              </span>
            </div>
          </button>
        ) : (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
