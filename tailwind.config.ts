import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // plus clair que #dc2626, souvent utilisé comme base
          600: '#dc2626', // ta couleur de base
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        primary33: {
          50: '#ffe2eb',  // Très clair
          100: '#ffb3c8', // Clair
          200: '#ff809f', // Moyen clair
          300: '#ff4d77', // Moyen
          400: '#e5295a', // Moyen foncé
          500: '#9e0e40', // Couleur primaire
          600: '#7c0933', // Foncé
          700: '#5a0625', // Très foncé
          800: '#3a0419', // Noirâtre
          900: '#1b010b'  // Presque noir
        },
        primaryOld: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      }
    }
  },
  plugins: [],
} satisfies Config