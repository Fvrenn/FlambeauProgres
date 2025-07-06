import {heroui} from "@heroui/theme"
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        "light-beige": "#E8E7DE",
        "dark-beige": "#DCDDD8", 
        "border-beige": "#F0EFE7",
        "border-beige-gris": "#EFEDE9",
        "medium-black": "#0F1511",
        "ivory": "#FFFFF0",
        "linen": "#FAF0E6",
        "wheat": "#F5DEB3",
        "khaki": "#F0E68C",
        "sage": "#9CAF88",
        "dusty-rose": "#DCAE96",
      }
    },
  },
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#F3F2E9",
          foreground: "#171717",
          primary: {
            DEFAULT: "#bbd0ff",
          },
          secondary: "#b8c0ff",
          success: "#d9ed92",
          warning: "#feb38f",
        }
      }
    }
  })],
}

module.exports = config;