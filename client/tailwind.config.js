/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
<<<<<<< HEAD
          bg: "#07080A",
          surface: "rgba(15, 17, 24, 0.75)",
          surfaceStrong: "rgba(20, 22, 31, 0.92)",
          border: "rgba(255, 255, 255, 0.08)",
          cyan: "#A3E635",      // Vibrant Neon Lime Green
          purple: "#00F0FF",    // Sky Cyan Accent
          amber: "#FB923C",     // Warm Orange
          gray: "#94A3B8",
          white: "#F8FAFC",
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 18px rgba(163, 230, 53, 0.15)',
        'purple-glow': '0 0 18px rgba(0, 240, 255, 0.15)',
        'amber-glow': '0 0 18px rgba(251, 146, 60, 0.15)',
        'glass': '0 12px 50px rgba(0, 0, 0, 0.6)',
=======
          bg: "#08090C",
          surface: "rgba(19, 23, 34, 0.62)",
          surfaceStrong: "rgba(13, 19, 33, 0.88)",
          border: "rgba(0, 240, 255, 0.18)",
          cyan: "#00F0FF",
          purple: "#9D00FF",
          amber: "#FF9900",
          gray: "#8E9CAE",
          white: "#FFFFFF",
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 18px rgba(0, 240, 255, 0.22)',
        'purple-glow': '0 0 18px rgba(157, 0, 255, 0.22)',
        'amber-glow': '0 0 18px rgba(255, 153, 0, 0.22)',
        'glass': '0 18px 80px rgba(0, 0, 0, 0.48)',
>>>>>>> e790a5f9057e66b31bd109b0ebf17dd5e5794264
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,240,255,0.18)' },
          '50%': { boxShadow: '0 0 26px rgba(0,240,255,0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-120% 0' },
          '100%': { backgroundPosition: '120% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.45s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
