import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Marca Vínculo ──────────────────────────────
      colors: {
        brand: {
          teal:       '#1A4A5A',
          'teal-light': '#245E74',
          'teal-dark':  '#112F3A',
          sand:       '#F2E8DC',
          'sand-dark': '#E8D8C8',
          gold:       '#B8955A',
          'gold-light': '#CDB07A',
        },
        neutral: {
          'off-white': '#FAFAF8',
          mist:        '#F4F4F2',
          border:      '#E2E2DE',
          'border-dark': '#D0D0CB',
          secondary:   '#6B7280',
          charcoal:    '#1F2937',
        },
        semantic: {
          success:        '#2D7D4F',
          'success-bg':   '#F0FDF4',
          warning:        '#D97706',
          'warning-bg':   '#FFFBEB',
          danger:         '#C0392B',
          'danger-bg':    '#FEF2F2',
          info:           '#2563EB',
          'info-bg':      '#EFF6FF',
        },
        // Aliases para shadcn/ui
        background:   'var(--background)',
        foreground:   'var(--foreground)',
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border:  'var(--border)',
        input:   'var(--input)',
        ring:    'var(--ring)',
      },

      // ── Tipografia ──────────────────────────────────
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'Times New Roman', 'serif'],
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',   { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl':  ['3rem',     { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-lg':  ['2.25rem',  { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'display-md':  ['1.875rem', { lineHeight: '1.3' }],
        'display-sm':  ['1.5rem',   { lineHeight: '1.35' }],
      },

      // ── Espaçamento e Bordas ────────────────────────
      borderRadius: {
        card:  '12px',
        input: '8px',
        badge: '6px',
        lg:    'var(--radius)',
        md:    'calc(var(--radius) - 2px)',
        sm:    'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card:    '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        modal:   '0 20px 60px rgba(0,0,0,0.15)',
        focus:   '0 0 0 3px rgba(26,74,90,0.25)',
      },

      // ── Animações ───────────────────────────────────
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        'out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in':   'fade-in 250ms ease-out',
        'slide-in':  'slide-in 250ms ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
