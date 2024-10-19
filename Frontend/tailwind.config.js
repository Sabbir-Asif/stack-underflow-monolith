/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cream-primary": "#FCFAEE",
        "blue-primary": "#384B70",
        "blue-secondary": "#507687"
      },
      fontFamily: {
        "exo": ["Exo 2", "sans-serif"],
        "poppins": ["Poppins", "sans-serif"]
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
}