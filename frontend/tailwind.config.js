/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          600: '#0265d2',
          900: '#0f172a',
          950: '#090d16',
        },
        hazard: {
          pothole: '#ef4444',
          water: '#3b82f6',
          pedestrian: '#f59e0b',
          traffic: '#8b5cf6',
          signboard: '#10b981',
        },
        light: {
          bg: '#ffffff',
          bg_secondary: '#f8fafc',
          border: '#e2e8f0',
          text: '#1e293b',
          text_secondary: '#64748b',
        },
        dark: {
          bg: '#090d16',
          bg_secondary: '#0f1419',
          border: '#1e293b',
          text: '#f1f5f9',
          text_secondary: '#cbd5e1',
        }
      },
      fontFamily: {
        sans: ['"Sora"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Sora"', '"Inter"', 'sans-serif'],
        sora: ['"Sora"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
