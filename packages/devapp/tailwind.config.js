import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, "./src/**/*.{html,js,ts,jsx,tsx}"),
  ],
  theme: {
  },
  plugins: [],
}

