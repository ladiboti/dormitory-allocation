/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        light:{
          background: '#B5C2CA',
          primary: '#FEFEFE',
          secondary: '#F0F3F4',
          accent: '#081225'
        },
      },
      fontFamily: {
        'primary': ['Josefin Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
}

