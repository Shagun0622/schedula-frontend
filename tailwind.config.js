/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:       "0 2px 16px rgba(0,188,212,0.08), 0 1px 4px rgba(0,0,0,0.06)",
        "card-hover":"0 8px 32px rgba(0,188,212,0.18), 0 2px 8px rgba(0,0,0,0.08)",
      },
      animation: {
        "fade-up":  "fadeUp 0.5s ease forwards",
        "slide-in": "slideIn 0.4s ease forwards",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideIn: { "0%": { opacity: "0", transform: "translateX(-12px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
module.exports = config;
