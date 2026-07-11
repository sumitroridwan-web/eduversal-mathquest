import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy primary
        navy: {
          50: "#eef1f7",
          100: "#dfe4ee",
          200: "#c1cbde",
          300: "#98a8c6",
          400: "#6a80a9",
          500: "#4a628f",
          600: "#3a4e75",
          700: "#31415f",
          800: "#2b3852",
          900: "#1b2540",
          950: "#0f1729",
        },
        // Teal / emerald secondary
        teal: {
          50: "#effcf6",
          100: "#c6f7e2",
          200: "#8eedc7",
          300: "#65d6ad",
          400: "#3ebd93",
          500: "#27ab83",
          600: "#199473",
          700: "#147d64",
          800: "#0c6b58",
          900: "#014d40",
        },
        // Warm yellow / orange accent
        accent: {
          50: "#fff9eb",
          100: "#ffedc2",
          200: "#ffdd8a",
          300: "#ffc94d",
          400: "#ffb420",
          500: "#f59e0b",
          600: "#d97b06",
          700: "#b45a09",
          800: "#92450e",
          900: "#78390f",
        },
        surface: {
          DEFAULT: "#ffffff",
          soft: "#f6f8fb",
          muted: "#eef1f6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 41, 0.06), 0 8px 24px -12px rgba(15, 23, 41, 0.12)",
        "card-hover": "0 4px 12px rgba(15, 23, 41, 0.08), 0 16px 40px -16px rgba(15, 23, 41, 0.2)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
