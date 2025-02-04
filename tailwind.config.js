/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,css,scss,sass,html}",

  ],
  theme: {
    extend: {
      colors: {
        'flame-orange': '#FF5F15',
        'sunny-yellow': '#FFD700',
        'sky-blue': '#4FB8E8',
        'dark-indigo': '#1A2238',
      },
    },
  },
  plugins: [],
}
