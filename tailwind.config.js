/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f0ff",
          100: "#e5e5ff",
          200: "#d0d0ff",
          300: "#b0adff",
          400: "#8b85ff",
          500: "#6b5fff",
          600: "#5a3ef8",
          700: "#4c2de4",
          800: "#3e25bf",
          900: "#34229c",
          950: "#1e126a",
        },
        accent: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        dark: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a26",
          600: "#22222f",
          500: "#2d2d3e",
        },
      },
      fontFamily: {
        display: ["'Clash Display'", "'DM Sans'", "system-ui", "sans-serif"],
        body: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 3s infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient":
          "radial-gradient(at 40% 20%, hsla(257, 98%, 64%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.2) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow": "0 0 30px rgba(107, 95, 255, 0.3)",
        "glow-sm": "0 0 15px rgba(107, 95, 255, 0.2)",
        "card": "0 4px 40px rgba(0, 0, 0, 0.08)",
        "card-dark": "0 4px 40px rgba(0, 0, 0, 0.4)",
        "product": "0 8px 40px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
