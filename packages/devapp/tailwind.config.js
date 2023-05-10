import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, "./src/**/*.{html,js,ts,jsx,tsx}"),
    path.join(__dirname, "node_modules/@oss-widgets/ui/components/**/*.{html,js,ts,jsx,tsx}"),
  ],
  theme: {
  },
  plugins: [],
}

