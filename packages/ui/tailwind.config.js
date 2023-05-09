/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sketch: ['CabinSketch', 'system-ui'],
      },
    },
  },
  plugins: []
}

