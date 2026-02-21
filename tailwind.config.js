/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#1a1a1a',
        primary: '#f97316',
        'primary-dark': '#ea580c',
        text: '#ffffff',
        'text-muted': '#6b7280',
        border: '#2a2a2a',
      },
    },
  },
  plugins: [],
};
