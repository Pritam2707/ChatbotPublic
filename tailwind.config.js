/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slide:'slideright 1s ease-in-out',
        slidedown: 'slidedown 1s ease-in-out ',
      },
      keyframes: {
        slidedown: {
          '0%':{ transform : 'translateY(-100%)'},
           '50%':{ transform : 'translateY(30%)'},
           '100%':{ transform : 'translateY(0%)'},
        },slideright: {
          '0%':{ transform : 'translateX(-100%)'},
           '50%':{ transform : 'translateX(30%)'},
           '100%':{ transform : 'translateX(0%)'},

        }
      }
    },
  },
  plugins: [],
}

