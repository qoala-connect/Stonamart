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
        // Warm espresso text (replaces near-black)
        "stone-dark": "#3a2f26",
        "stone-950": "#2b231c",
        "slate-900": "#2b231c",

        // Warm cream & off-white (site base)
        "stone-light": "#FBF7F1",
        "cream-50": "#FDFBF8",
        "cream-100": "#F6F0E6",

        // Warm metallic / gold accents
        "amber-gold": "#B8865A",
        "champagne": "#E8DCC4",
        "bronze-accent": "#8B6F47",

        // Functional palette
        "accent-primary": "#B8865A",
        "accent-secondary": "#8B6F47",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "600" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", fontWeight: "600" }],
        "heading-xl": ["2rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.5" }],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        "luxury": "0 2px 10px -2px rgba(58, 47, 38, 0.08), 0 1px 4px -1px rgba(58, 47, 38, 0.04)",
        "luxury-lg": "0 12px 32px -8px rgba(58, 47, 38, 0.12), 0 4px 10px -4px rgba(58, 47, 38, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
