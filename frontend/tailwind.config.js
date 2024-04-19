/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bebas Neue', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}