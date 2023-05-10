import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, "./components/**/*.{html,js,ts,jsx,tsx}"),
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

