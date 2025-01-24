/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#2D3748',
        secondary: '#4A5568',
        accent: '#ED8936',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
      },
    },
  },
  plugins: [],
};