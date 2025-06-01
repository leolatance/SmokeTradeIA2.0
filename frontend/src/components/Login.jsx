import { useState } from 'react'

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('smoketrade_token', data.token);
        setLoggedIn(true);
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-fundo">
      <div className="bg-cinza p-8 rounded-xl w-full max-w-md space-y-6">
        <h1 className="text-4xl text-limao font-orbitron text-center">
          SmokeTrade 🤖💨
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-roxo font-poppins text-center">{error}</div>
          )}
          
          <div>
            <label className="block text-branco font-poppins mb-2">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-fundo rounded-lg p-3 text-branco border border-roxo focus:outline-none focus:border-limao"
            />
          </div>
          
          <div>
            <label className="block text-branco font-poppins mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-fundo rounded-lg p-3 text-branco border border-roxo focus:outline-none focus:border-limao"
            />
          </div>
          
          <button className="w-full bg-limao text-fundo font-orbitron py-3 rounded-lg neon-effect hover:bg-opacity-90">
            Acessar Plataforma
          </button>
        </form>

        <p className="text-center text-branco font-poppins text-sm">
          Problemas no acesso? Contate nosso suporte
        </p>
      </div>
    </div>
  )
}