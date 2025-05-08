// frontend/vite.config.cjs
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

module.exports = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Limpa o diretório de build anterior
    assetsDir: 'assets', // Organiza os arquivos estáticos
    sourcemap: false // Desliga sourcemaps para produção
  },
  server: {
    port: 5173,
    strictPort: true // Impede a troca automática de porta
  },
  base: './', // Configuração crucial para o Vercel
  publicDir: 'public' // Garante o diretório público correto
});