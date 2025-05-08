module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        limao: '#32CD32',
        fundo: '#0f2e1d',
        roxo: '#6a0dad',
        branco: '#f0f0f0',
        cinza: '#1c1c1e'
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [],
}