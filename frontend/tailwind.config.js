/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        krona: ['Krona One']
      },
      colors: {
        "bliss-black": "#121212",
        "bliss-grey": "#606060",
        "bliss-white": "#fff",
        "bliss-pink": "#FF2B90"
      }
    },
  },
  plugins: [],
}

