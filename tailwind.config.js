/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        marsRed: "#e63946",
        marsRedDark: "#b72d3b",
        spaceBlack: "#0b0c10",
        slate: {
          850: "#1e293b",
          950: "#0f172a",
        },
      },
      boxShadow: {
        mars: "0 0 20px rgba(230, 57, 70, 0.4)",
        'inner-slate': "inset 0 2px 4px 0 rgba(30,41,59,0.6)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
