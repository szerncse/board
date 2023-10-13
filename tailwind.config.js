/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./page/*.{html,ejs,js,ts}",
    "./views/*.{ejs,html,js,ts}"

],
  theme: {
    extend: {},
  },
  plugins: [],
}

