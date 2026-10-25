/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a12",
            foreground: "#ececf4",
            content1: "#12121c",
            content2: "#1a1a28",
            content3: "#242435",
            content4: "#2e2e44",
            divider: "rgba(255,255,255,0.08)",
            primary: { DEFAULT: "#7c5cff", foreground: "#ffffff" },
            secondary: { DEFAULT: "#22d3ee", foreground: "#04121a" },
            success: { DEFAULT: "#34d399", foreground: "#04120c" },
            warning: { DEFAULT: "#fbbf24", foreground: "#1a1200" },
            danger: { DEFAULT: "#fb7185", foreground: "#1a0409" },
          },
        },
      },
    }),
  ],
}
