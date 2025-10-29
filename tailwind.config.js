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
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          default: {
            50: "#f0eff8",
            100: "#E8E7DE",
            200: "#c7c1e3",
            300: "#b2aad9",
            400: "#9e93cf",
            500: "#0f1511",
            600: "#909090",
            700: "#595180",
            800: "#413b5e",
            900: "#29253b",
            foreground: "#000",
            DEFAULT: "#E8E7DE"
          },
          primary: {
            50: "#ffdfdf",
            100: "#ffb3b3",
            200: "#ff8686",
            300: "#ff5959",
            400: "#ff2d2d",
            500: "#ff0000",
            600: "#d20000",
            700: "#a60000",
            800: "#790000",
            900: "#4d0000",
            foreground: "#000",
            DEFAULT: "#ff0000"
          },
          secondary: {
            50: "#fffbdf",
            100: "#fff5b3",
            200: "#ffee86",
            300: "#ffe859",
            400: "#ffe22d",
            500: "#ffdc00",
            600: "#d2b600",
            700: "#a68f00",
            800: "#796900",
            900: "#4d4200",
            foreground: "#000",
            DEFAULT: "#ffdc00"
          },
          success: {
            50: "#e3f8ef",
            100: "#bbedd8",
            200: "#93e3c1",
            300: "#6bd9ab",
            400: "#43ce94",
            500: "#1bc47d",
            600: "#16a267",
            700: "#127f51",
            800: "#0d5d3b",
            900: "#083b26",
            foreground: "#000",
            DEFAULT: "#1bc47d"
          },
          warning: {
            50: "#fff5df",
            100: "#ffe8b3",
            200: "#ffda86",
            300: "#ffcc59",
            400: "#ffbf2d",
            500: "#ffb100",
            600: "#d29200",
            700: "#a67300",
            800: "#795400",
            900: "#4d3500",
            foreground: "#000",
            DEFAULT: "#ffb100"
          },
          danger: {
            50: "#ffe9e9",
            100: "#ffcaca",
            200: "#ffabab",
            300: "#ff8d8d",
            400: "#ff6e6e",
            500: "#ff4f4f",
            600: "#d24141",
            700: "#a63333",
            800: "#792626",
            900: "#4d1818",
            foreground: "#000",
            DEFAULT: "#ff4f4f"
          },
          background: "#F3F2E9",
          foreground: "#0f1511",
          content1: {
            DEFAULT: "#f2e8ff",
            foreground: "#000"
          },
          content2: {
            DEFAULT: "#e8daff",
            foreground: "#000"
          },
          content3: {
            DEFAULT: "#dccbff",
            foreground: "#000"
          },
          content4: {
            DEFAULT: "#cfbcff",
            foreground: "#000"
          },
          focus: "#7828c8",
          overlay: "#000000"
        }
      }
    },
    layout: {
      disabledOpacity: "0.5"
    }
  })],
}

module.exports = config;