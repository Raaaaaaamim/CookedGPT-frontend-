/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: "#7c3aed", // Gen Z purple
          dark: "#0f172b",
          light: "#8b5cf6",
        },

        // Text colors
        text: {
          primary: "#1f2937", // gray-900
          secondary: "#374151", // gray-700
          tertiary: "#6b7280", // gray-500
          light: "#f9fafb", // gray-50
          white: "#ffffff",
        },

        // Background colors
        background: {
          DEFAULT: "#ffffff",
          secondary: "#f9fafb", // gray-50
          dark: "#111827",
        },

        // Border colors
        border: {
          light: "#e5e7eb", // gray-200
          DEFAULT: "#d1d5db", // gray-300
          dark: "#9ca3af", // gray-400
          darker: "#4b5563", // gray-600
          darkest: "#1f2937", // gray-900
        },

        // State colors
        state: {
          success: "#10b981", // emerald-500
          warning: "#f59e0b", // amber-500
          error: "#ef4444", // red-500
          info: "#3b82f6", // blue-500
        },

        // Transformation types
        transformation: {
          pro: {
            text: "#1f2937", // gray-900
            bg: "#f9fafb", // gray-50
          },
          savage: {
            text: "#dc2626", // red-600
            bg: "#fef2f2", // red-50
          },
          genz: {
            text: "#7c3aed", // purple-600
            bg: "#faf5ff", // purple-50
          },
          insult: {
            text: "#ea580c", // orange-600
            bg: "#fff7ed", // orange-50
          },
        },

        // UI elements
        button: {
          primary: "#111827", // gray-900
          disabled: "#e5e7eb", // gray-200
          text: {
            primary: "#ffffff",
            disabled: "#9ca3af", // gray-400
          },
        },
      },

      // Custom shadows
      boxShadow: {
        button: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
        card: "0 4px 16px 0 rgba(0, 0, 0, 0.08)",
      },

      // Border radius
      borderRadius: {
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
      },
    },
  },
  plugins: [],
};
