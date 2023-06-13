/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx}',
    './packages/**/*.{ts,tsx,scss}'
  ],
  theme: {
    extend: {
      textColor: utils => ({
        primary: utils.colors.gray["700"],
        secondary: utils.colors.gray["500"],
      }),
      borderColor: {
        editing: '#C5AC8F',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sketch: ['CabinSketch', 'system-ui'],
        mono: ['Menlo', 'Monaco', "Courier New", 'monospace'],
      },
    },
  },
  plugins: [],
}
