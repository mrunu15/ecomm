/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        instrument: ['"Instrument Sans"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        rainbow: {
          '0%, 100%': { color: '#F87171' }, // red
          '14%': { color: '#FBBF24' }, // yellow
          '28%': { color: '#34D399' }, // green
          '42%': { color: '#60A5FA' }, // blue
          '56%': { color: '#A78BFA' }, // purple
          '70%': { color: '#F472B6' }, // pink
          '84%': { color: '#F87171' }, // red again
        },
      },
      animation: {
        'float': 'float 1s ease-in-out infinite',
        'rainbow': 'rainbow 2s linear infinite',
      },
    },
  },
  plugins: [],
}
