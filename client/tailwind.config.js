/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,選び}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#08090C",
          surface: "rgba(19, 23, 34, 0.6)",
          border: "rgba(0, 240, 255, 0.15)",
          cyan: "#00F0FF",
          purple: "#9D00FF",
          amber: "#FF9900",
          gray: "#8E9CAE",
          white: "#FFFFFF",
          cardBg: "#111522"
        }
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 240, 255, 0.3)',
        'purple-glow': '0 0 15px rgba(157, 0, 255, 0.3)',
        'amber-glow': '0 0 15px rgba(255, 153, 0, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
