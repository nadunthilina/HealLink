/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // blue-700
        accent: '#3B82F6',  // blue-500
        soft: '#EEF2FF',
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}

