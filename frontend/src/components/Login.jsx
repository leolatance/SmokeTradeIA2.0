import { useState } from 'react'
import { verifyUser } from '../auth/Users.js'

export default function Login({ setLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const user = await verifyUser(email, password)
    if(user) {
      localStorage.setItem('smoketrade_token', user.accessToken)
      setLoggedIn(true)
    } else {
      setError('Credenciais inválidas ou acesso não autorizado')
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