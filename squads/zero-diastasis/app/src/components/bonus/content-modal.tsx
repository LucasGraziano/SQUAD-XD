'use client';

import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

type ContentModalProps = {
  url: string;
  title: string;
  onClose: () => void;
};

export function ContentModal({ url, title, onClose }: ContentModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full md:max-w-3xl md:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col animate-slide-up"
           style={{ height: '92vh', maxHeight: '92vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-100 flex-shrink-0">
          <h2 className="font-heading font-bold text-foreground truncate pr-4">{title}</h2>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-secondary-50 text-foreground/50 hover:bg-secondary-100 transition-colors"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-secondary-50 text-foreground/50 hover:bg-secondary-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        {/* Iframe */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
