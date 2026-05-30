import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add to your globals.css:
        // @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500&display=swap');
        sans: ["Geist", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        serif: ["Instrument Serif", "serif"],
        geist: ["Geist", "sans-serif"],
      },
      colors: {
        fb: {
          bg: "#0d0e11",
          surface: "#13151a",
          "surface-hover": "#1a1d24",
          border: "#23262f",
          "border-strong": "#2e3140",
          text: "#e8eaf0",
          muted: "#7c8296",
          faint: "#454959",
          amber: "#e8a838",
          "amber-dim": "#1f1a0e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
