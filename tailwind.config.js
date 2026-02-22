/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0a0a0a',
        secondary: '#1a1a1a',
        accent: '#d4af37',
        'accent-hover': '#b5952f',
        danger: '#cf6679',
        success: '#03dac6',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        cinzel: ['Cinzel', 'serif'],
        fraunces: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}
