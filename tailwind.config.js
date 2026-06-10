/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0064FF',
          dark: '#0050CC',
          light: '#E6F0FF',
        },
        accent: {
          DEFAULT: '#FF6B00',
          light: '#FFF0E6',
        },
      },
      fontFamily: {
        sans: ["'Noto Sans KR'", "'Apple SD Gothic Neo'", "'Malgun Gothic'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
