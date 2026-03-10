import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfe2fd',
          300: '#93d2fc',
          400: '#60bbf8',
          500: '#3c9ff2',
          600: '#2783e6',
          700: '#216ed3',
          800: '#2259ab',
          900: '#224e87',
        },
      },
      boxShadow: {
        panel: '0 1px 2px 0 rgb(15 23 42 / 0.05), 0 10px 30px -15px rgb(30 64 175 / 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
