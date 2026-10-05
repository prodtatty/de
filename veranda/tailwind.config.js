/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Figtree', 'Onest', 'system-ui', 'sans-serif'] },
      screens: {
        mobile: { max: '809.98px' },
        'md-tablet': { min: '810px', max: '1199.98px' },
      },
    },
  },
  plugins: [],
}
