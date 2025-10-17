/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '15px'
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    colors: {
      'main-color': '#ff0000'
    }
  },
  plugins: [],
}

