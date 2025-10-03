/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          500: '#6750A4',
          600: '#5b4791',
          700: '#4f3d7e',
        },
        panic: {
          500: '#DC2626',
          600: '#b91c1c',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C1B1F',
        }
      },
      animation: {
        'pulse-emergency': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}