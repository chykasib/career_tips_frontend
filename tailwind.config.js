/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: {
          600: "#1A365D",
          800: "#0F2557",
        },
      },
    },
  },
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include your source folder
  ],
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui")],
};
