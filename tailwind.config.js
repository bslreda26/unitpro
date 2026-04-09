/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E31B23',
        dark: '#0A0A0A',
        surface: '#111111',
        border: '#1F1F1F',
        text: {
          primary: '#FFFFFF',
          muted: '#888888',
        },
        accent: '#FF3C44',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

