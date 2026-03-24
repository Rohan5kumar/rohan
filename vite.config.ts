// This project uses Webpack, not Vite
// This file exists only to eliminate TypeScript errors in IDE
// @ts-nocheck

export default {
  plugins: [],
  build: {
    rollupOptions: {
      external: ['@tailwindcss/vite', '@vitejs/plugin-react', 'vite']
    }
  }
};
