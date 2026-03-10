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
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};

export default config;
