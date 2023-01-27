/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['nunito'],
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      fhd: '1920px',
    },
  },
  plugins: [],
};
