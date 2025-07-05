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
        primary: "#bbd0ff",
        secondary: "#b8c0ff", 
        tertiary: "#d9ed92",
        accent: "#feb38f",
        background: "#F3F2E9",
        foreground: "#171717",
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#ffffff",
          foreground: "#171717",
          primary: {
            50: "#f0f4ff",
            500: "#bbd0ff",
            900: "#1a237e",
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