/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      colors: {
        'bg-dark': '#0F0F0F',
        'bg-dark-alt': '#111111',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B3B3B3',
        'border-subtle': '#2A2A2A',
        'border-focus': '#444444',
      },
      maxWidth: {
        'container': '1200px',
        'content': '700px',
      },
    },
  },
  plugins: [],
}
