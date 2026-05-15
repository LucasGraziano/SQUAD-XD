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
      colors: {
        // Sidebar
        sidebar: {
          bg: '#0D0D0D',
          border: '#1A1A1A',
          text: '#8B8C81',
          'text-hover': '#F0F2DF',
          'text-active': '#FFFFFF',
        },
        // Canvas / Content
        canvas: '#F8F8F8',
        surface: '#FFFFFF',
        border: {
          DEFAULT: '#E5E5E5',
          strong: '#D1D1D1',
        },
        // Text
        text: {
          primary: '#0D0D0D',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
        },
        // Lucky Brand
        lucky: {
          green: '#0BD904',
          'green-dark': '#034001',
          'green-subtle': 'rgba(11,217,4,0.10)',
          offwhite: '#F0F2DF',
          gray: '#8B8C81',
        },
        // Semantic
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        info: '#2563EB',
      },
      fontFamily: {
        display: ['var(--font-atyp)', '"Helvetica Neue"', 'sans-serif'],
        ui: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
        badge: '4px',
      },
    },
  },
  plugins: [],
}

export default config
