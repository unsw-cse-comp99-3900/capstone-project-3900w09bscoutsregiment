/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary-theme-lb': '#0075FF',
        'primary-theme-db': '#004699',
      },
      // still  unsure on how it works
      // colors: {
      //   accent: {
      //     1: "hsl(var(--color-accent1) / <alpha-value>)",
      //     2: "hsl(var(--color-accent2) / <alpha-value>)",
      //   },
      //   bkg: "hsl(var(--color-bkg) / <alpha-value>)",
      //   content: "hsl(var(--color-content) / <alpha-value>)",
      // },
    },
  },
  plugins: [],
};
