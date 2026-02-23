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
        surface: {
          800: "#1a1a1a",
          700: "#242424",
          600: "#2a2a2a",
          500: "#333333",
        },
        accent: "#1db954",
        accentHover: "#1ed760",
      },
    },
  },
  plugins: [],
};

export default config;
