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
        'gold': {
          DEFAULT: '#d4af37',
          light: '#f2ca50',
          dark: '#aa8c2c'
        },
        'dark': {
          DEFAULT: '#0a0a0a',
          card: '#141414',
          border: '#262626'
        }
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f2ca50 0%, #d4af37 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)'
      }
    },
  },
  plugins: [],
}
