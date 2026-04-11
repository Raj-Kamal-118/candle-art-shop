import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfcf9",
          100: "#faf7f0",
          200: "#f5ede0",
          300: "#eedcc5",
          400: "#e4c49e",
          500: "#d9a87a",
        },
        forest: {
          50: "#f0f7f4",
          100: "#dceee6",
          200: "#b8dccf",
          300: "#8bc3ae",
          400: "#5ca58c",
          500: "#3d8a72",
          600: "#2e6d59",
          700: "#255748",
          800: "#1e4438",
          900: "#1a3828",
          950: "#0d1e15",
        },
        coral: {
          50: "#fdf3f2",
          100: "#fde4e2",
          200: "#fbccc9",
          300: "#f7a9a4",
          400: "#f07b72",
          500: "#e56058",
          600: "#c4564a",
          700: "#a34038",
          800: "#873730",
          900: "#70322c",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#e8c040",
          500: "#d4a820",
          600: "#b88e14",
          700: "#9a7310",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
