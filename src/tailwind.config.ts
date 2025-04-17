import type { Config } from "tailwindcss"

const config: Config = {
  content: [
   "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        foreground: "#fca311",
        primary: "#ffffff", 
        secondary: "#ffedc2", // optional: soft pale orange
      },
    },
  },
  plugins: [],
}
export default config
