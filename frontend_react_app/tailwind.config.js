/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        success: "#06b6d4",
        secondary: "#64748b",
        surface: "#ffffff",
        background: "#f9fafb",
        text: "#111827",
        danger: "#EF4444"
      }
    }
  },
  plugins: []
};
