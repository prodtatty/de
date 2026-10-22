/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0E0D0B',
        ink2: '#161512',
        ivory: '#EDE8DF',
        stone: '#8A857C',
        bronze: '#A88B5E',
        line: 'rgba(237,232,223,0.12)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
