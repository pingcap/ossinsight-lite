/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{html,js,ts,jsx,tsx}"
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

