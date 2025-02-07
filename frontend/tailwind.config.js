/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gold': {
          DEFAULT: '#c2a25d',
          dark: '#ad8d49',
        },
        'primary': {
          lightest: '#38785e',
          light: '#185542',
          DEFAULT: '#06543c',
          dark: '#053426',
        }
      },
      container: {
        padding: {
          md: "10rem",
        },
      },
    },
  },
  plugins: [],
};
