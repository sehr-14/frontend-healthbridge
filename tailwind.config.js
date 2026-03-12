/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        moss: "#2E4036",
        clay: "#CC5833",
        cream: "#F2F0E9",
        charcoal: "#1A1A1A",
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
