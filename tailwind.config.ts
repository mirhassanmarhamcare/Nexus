import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        foreground: "var(--text-color)",
        muted: "var(--text-muted)",
        accent: "var(--accent-color)",
        danger: "var(--danger-color)",
        card: "var(--card-bg)",
        border: "var(--border-color)",
      },
      fontFamily: {
        main: "var(--font-main)",
        display: "var(--font-display)",
      },
    },
  },
  plugins: [],
  darkMode: ["class", '[data-theme="dark"]'],
};
export default config;
