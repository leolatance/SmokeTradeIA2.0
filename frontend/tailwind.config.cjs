module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        limao: '#32CD32',         // ação principal
        fundo: '#0f2e1d',         // fundo principal
        roxo: '#6a0dad',         // realces psicodélicos
        vermelho: '#FF4444',      // compra
        branco: '#f0f0f0',       // texto em fundo escuro
        cinza: '#1c1c1e',        // cartões e caixas
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],  // mantido como classe utilitária
        body: ['Poppins', 'sans-serif']       // tipografia principal alterada
      }
    },
  },
  plugins: [],
}