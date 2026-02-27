/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#030213',
        'primary-foreground': '#ffffff',
        background: '#0f0f23',
        foreground: '#f8f8f8',
        muted: '#1a1a2e',
        'muted-foreground': '#a0a0b0',
        accent: '#6366f1',
        'accent-foreground': '#ffffff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
});
