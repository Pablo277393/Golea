/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#d4af37', // Gold
          light: '#f2ca50',
          dark: '#aa8c2c',
          glow: 'rgba(212, 175, 55, 0.4)'
        },
        'dark': {
          DEFAULT: '#0a0a0a', // Background
          card: '#141414',   // Surface
          border: '#262626', // Border
          muted: '#1a1a1a'
        },
        'surface': '#141414', // Alias for dark.card
        'slate': {
          200: '#e2e8f0',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569'
        }
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        'surface-gradient': 'linear-gradient(to bottom, #141414, #0a0a0a)'
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
