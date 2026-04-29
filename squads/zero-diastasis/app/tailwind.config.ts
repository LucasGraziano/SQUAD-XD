import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4A5A5',
          50: '#FDF5F5',
          100: '#F9E8E8',
          200: '#EDCFCF',
          300: '#D4A5A5',
          400: '#C48989',
          500: '#B46D6D',
          600: '#9A5252',
          700: '#7A4141',
          800: '#5A3030',
          900: '#3A2020',
        },
        secondary: {
          DEFAULT: '#F5E6D3',
          50: '#FFFCF8',
          100: '#FAF0E4',
          200: '#F5E6D3',
          300: '#E8D0B3',
          400: '#DBBA93',
          500: '#CEA473',
        },
        accent: {
          DEFAULT: '#C9A96E',
          50: '#FBF7EF',
          100: '#F3EACD',
          200: '#E5D5A1',
          300: '#D6BF7A',
          400: '#C9A96E',
          500: '#B59350',
        },
        background: '#FFFAF5',
        foreground: '#2D2D2D',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceGentle: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
