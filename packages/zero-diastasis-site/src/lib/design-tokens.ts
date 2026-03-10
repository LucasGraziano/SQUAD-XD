/**
 * Design Tokens — Single Source of Truth
 *
 * All visual constants for the Zero Diastasis project live here.
 * Import from this file instead of hardcoding values in components.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColorGroup {
  DEFAULT: string;
  light: string;
  dark?: string;
  strong?: string;
}

export interface Colors {
  blush: ColorGroup;
  nude: ColorGroup;
  warm: string;
  gold: ColorGroup;
  text: { DEFAULT: string; light: string; muted: string };
  success: string;
  ctaHover: string;
}

export interface FontScale {
  display: string;
  h1: string;
  h2: string;
  h3: string;
  bodyLg: string;
  body: string;
  small: string;
}

export interface Typography {
  fontFamily: { serif: string; sans: string };
  fontSize: FontScale;
  fontWeight: { normal: number; medium: number; semibold: number; bold: number };
  lineHeight: { tight: number; normal: number; relaxed: number };
}

export interface Spacing {
  sectionPadding: { x: string; y: string };
  contentMaxWidth: string;
  containerPadding: string;
}

export interface Shadows {
  soft: string;
  card: string;
  elevated: string;
  glow: string;
}

export interface Radii {
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface AnimationPreset {
  initial: Record<string, number>;
  animate: Record<string, number>;
  transition: { duration: number; ease: string; delay?: number };
}

export interface StaggerVariants {
  hidden: Record<string, unknown>;
  visible: {
    transition: { staggerChildren: number; delayChildren?: number };
  };
}

export interface StaggerItemVariants {
  hidden: Record<string, number>;
  visible: {
    opacity: number;
    y: number;
    transition: { duration: number; ease: string };
  };
}

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// ---------------------------------------------------------------------------
// Color Tokens
// ---------------------------------------------------------------------------

/** Brand and semantic color palette. */
export const colors: Colors = {
  blush: {
    DEFAULT: '#D4A5A5',
    light: '#E8C5C5',
    strong: '#C97B7B',
    dark: '#B06868',
  },
  nude: {
    DEFAULT: '#F5E6D3',
    light: '#FAF0E6',
    dark: '#E8D5BE',
  },
  warm: '#FFFAF5',
  gold: {
    DEFAULT: '#A8893E',
    light: '#C9A96E',
    dark: '#8B6914',
  },
  text: {
    DEFAULT: '#2D2D2D',
    light: '#6B6B6B',
    muted: '#9B9B9B',
  },
  success: '#7CB68E',
  ctaHover: '#B56A6A',
};

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

/** Font families, sizes, weights and line-heights. */
export const typography: Typography = {
  fontFamily: {
    serif: '"Playfair Display", serif',
    sans: '"Inter", sans-serif',
  },
  fontSize: {
    display: '3.5rem',
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.5rem',
    bodyLg: '1.125rem',
    body: '1rem',
    small: '0.875rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

/** Layout spacing and container widths. */
export const spacing: Spacing = {
  sectionPadding: { x: '1.5rem', y: '5rem' },
  contentMaxWidth: '1200px',
  containerPadding: '1rem',
};

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

/** Elevation shadow tokens (CSS box-shadow strings). */
export const shadows: Shadows = {
  soft: '0 2px 8px rgba(0, 0, 0, 0.06)',
  card: '0 4px 16px rgba(0, 0, 0, 0.08)',
  elevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
  glow: '0 0 24px rgba(212, 165, 165, 0.3)',
};

// ---------------------------------------------------------------------------
// Border Radius
// ---------------------------------------------------------------------------

/** Border-radius scale. */
export const radii: Radii = {
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
};

// ---------------------------------------------------------------------------
// Animations (Framer Motion)
// ---------------------------------------------------------------------------

/** Standard animation durations in seconds. */
export const durations = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.7,
} as const;

/** Standard easing curves. */
export const easings = {
  easeOut: 'easeOut',
  easeIn: 'easeIn',
  easeInOut: 'easeInOut',
} as const;

/**
 * Fade-in animation preset.
 * @param delay - optional delay in seconds (default 0)
 */
export function fadeIn(delay = 0): AnimationPreset {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: durations.normal, ease: easings.easeOut, delay },
  };
}

/**
 * Slide-up animation preset (fades in while translating upward).
 * @param delay - optional delay in seconds (default 0)
 */
export function slideUp(delay = 0): AnimationPreset {
  return {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: durations.slow, ease: easings.easeOut, delay },
  };
}

/**
 * Parent variants for staggered children animations.
 * @param staggerDelay - delay between each child in seconds (default 0.1)
 */
export function staggerContainer(staggerDelay = 0.1): StaggerVariants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay },
    },
  };
}

/** Child variants used inside a stagger container. */
export const staggerItem: StaggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
};

/** Grouped animation utilities for convenient imports. */
export const animations = {
  fadeIn,
  slideUp,
  staggerContainer,
  staggerItem,
  durations,
  easings,
} as const;

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

/** Responsive breakpoints (min-width values). */
export const breakpoints: Breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};
