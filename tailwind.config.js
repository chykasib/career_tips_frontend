/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include your source folder
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
};
