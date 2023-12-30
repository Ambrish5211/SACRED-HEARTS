/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["dark", "cupcake", "valentine", "garden", "light"],
  },
  plugins: [require("daisyui")],
};
