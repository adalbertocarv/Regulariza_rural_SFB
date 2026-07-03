/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'destaque-1': '#038E5C',
        'destaque-2': '#1A68FF',
        'preto-5': '#f2f2f2',
        'preto-10': '#e6e6e6',
        'fundo-escuro': '#1F3A30',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        headline: ['"Titillium Web"', 'sans-serif'],
        serif: ['"Titillium Web"', 'sans-serif'],
        mono: ['"Titillium Web"', 'monospace'],
      },
    },
  },
  plugins: [],
};
