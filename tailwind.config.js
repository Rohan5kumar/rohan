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
        'heading': ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: 'var(--primary)',
        'primary-glow': 'var(--primary-glow)',
        bg: 'var(--bg)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        glass: 'var(--glass)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}
