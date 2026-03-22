/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        primary: '#10b981',
        'primary-glow': 'rgba(16, 185, 129, 0.2)',
        bg: '#050505',
        text: '#ffffff',
        'text-muted': '#a3a3a3',
        glass: 'rgba(255, 255, 255, 0.05)',
        border: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}
