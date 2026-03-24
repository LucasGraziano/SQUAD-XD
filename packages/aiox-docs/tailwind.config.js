/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0A0A0F',
          800: '#111118',
          700: '#1A1A24',
          600: '#222230',
          500: '#2A2A3A',
        },
        coral: {
          DEFAULT: '#E8837C',
          light: '#F2A49F',
          dark: '#D4635C',
        },
        menta: {
          DEFAULT: '#7ECEC1',
          light: '#A8E0D6',
          dark: '#5BB5A6',
        },
        gold: {
          DEFAULT: '#D4A574',
          light: '#E8C9A8',
          dark: '#B8874F',
        },
        text: {
          primary: '#F0F0F5',
          secondary: '#9999AA',
          muted: '#666677',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
