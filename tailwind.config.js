/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    colors: {
      accent: "var(--accent-color)",
      textColor: "var(--text-color)",
      backgroundColor: "var(--bg-color)",
      backgroundColorSecondary: "var(--bg-color-secondary)",
      error: "var(--error-color)",
      loginForm: "#2F4B87",
      blue: {
        100: "#dbeafe",
        300: "#93c5fd",
        500: "#3b82f6",
        700: "#1d4ed8",
      },
      red: {
        100: "#fee2e2",
        300: "#fca5a5",
        500: "#ef4444",
        700: "#b91c1c",
      },
      green: {
        100: "#dcfce7",
        300: "#86efac",
        500: "#22c55e",
        700: "#15803d",
      },
      yellow: {
        100: "#fef9c3",
        300: "#fde047",
        500: "#eab308",
        700: "#a16207",
      },
      gray: {
        100: "#f3f4f6",
        300: "#d1d5db",
        500: "#6b7280",
        700: "#374151",
      },
      white: "#fff",
      black: "#111",
    },
    fontFamily: {
      iranSansFaNum: "iranSansFaNum",
    },
    maxWidth: {
      sideBarWidth: "var(--sidebar-width)",
      pagesWidth: "var(--pages-width)",
    },
    minWidth: {
      sideBarWidth: "var(--sidebar-width)",
    },
    minHeight: {
      header: "var(--header-height)",
      pagesHeight: "var(--pages-height)",
    },
    maxHeight: {
      header: "var(--header-height)",
      pagesHeight: "var(--pages-height)",
    },
    extend: {
      transitionProperty: {
        transform: "transform",
      },
      transitionDuration: {
        500: "500ms",
        1000: "1000ms",
        5000: "5000ms",
      },
      animation: {
        showBackground: "showBackground 5s ease-in-out infinite",
        showSearchInput: "showSearchInput 0.5s ease alternate",
        hoverFoodCard: "hoverFoodCard 0.3s forwards ease alternate",
      },
    },
  },
  plugins: [],
};
