'use client';

import Image from 'next/image';

interface ImagePlaceholderProps {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  /** Placeholder label shown when no real image exists */
  placeholderLabel?: string;
}

/**
 * Smart image component: shows real image if src exists,
 * otherwise renders a styled placeholder with gradient.
 */
export default function ImagePlaceholder({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholderLabel,
}: ImagePlaceholderProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-nude via-blush-light/40 to-nude-dark/30 flex items-center justify-center ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
      role="img"
      aria-label={alt}
    >
      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-8 w-32 h-32 bg-blush/20 rounded-full blur-2xl" />
      <div className="absolute bottom-1/4 -right-8 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />

      <div className="relative text-center px-4">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/60 flex items-center justify-center">
          <svg className="w-6 h-6 text-blush-strong/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
          </svg>
        </div>
        {placeholderLabel && (
          <p className="text-xs text-text-muted/60 font-medium">{placeholderLabel}</p>
        )}
      </div>
    </div>
  );
}
