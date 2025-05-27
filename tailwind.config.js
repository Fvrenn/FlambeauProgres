const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#bbd0ff',
        secondary: '#b8c0ff',
        tertiary: '#d9ed92',
        white: '#ffffff',
        accent: '#feb38f',
        dark: '#171717',
        light: '#ededed',
      },
      fontFamily: {
        koulen: ['Koulen', 'cursive'],
        LuckiestGuy: ['Luckiest Guy', 'cursive'],
      },
      borderRadius: {
        'sm': '30px',
        'md': '53px',
        'lg': '55px',
        'xl': '67px',
      },
      spacing: {
        'xs': '10px',
        'sm': '20px',
        'md': '27px',
        'lg': '40px',
        'xl': '45px',
      },
      fontSize: {
        'header': '67px',
      },
      screens: {
        'tablet': {'max': '1432px'},
        'mobile': {'max': '842px'},
      },
    },
  },
  plugins: [heroui()],
}