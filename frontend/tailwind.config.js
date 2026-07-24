/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'phf': '#3b82f6',
        'rtf': '#10b981',
        'sf': '#f59e0b',
        'jcf': '#8b5cf6',
        'gas': '#06b6d4',
      }
    },
  },
  plugins: [],
}
