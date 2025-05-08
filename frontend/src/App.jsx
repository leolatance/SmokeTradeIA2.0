import { useState, useEffect } from 'react'
import { users } from './auth/Users.js'
import { getMarketAnalysis } from './lib/marketAnalysis'
import Login from './components/Login'
import CurrencySelector from './components/CurrencySelector'
import TimeSelector from './components/TimeSelector'
import SignalDisplay from './components/SignalDisplay'
import History from './components/History'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [selectedTime, setSelectedTime] = useState(1)
  const [signals, setSignals] = useState([])
  const [historyReload, setHistoryReload] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('smoketrade_token')
    const user = users.find(u => u.accessToken === token)
    
    if(user && new Date(user.validade) > new Date()) {
      setLoggedIn(true)
    } else {
      localStorage.removeItem('smoketrade_token')
    }
  }, [])

  const generateSignal = async () => {
    if(signals.length >= 3) {
      alert('Limite máximo de 3 sinais simultâneos!')
      return
    }

    try {
      const analysis = await getMarketAnalysis(selectedPair)
      
      const newSignal = {
        id: Date.now(),
        pair: selectedPair,
        analysis: analysis,
        direction: Math.random() > 0.5 ? 'CALL' : 'PUT',
        duration: selectedTime,
        timestamp: new Date().toLocaleString()
      }

      setSignals(prev => [...prev, newSignal])
      
      const history = JSON.parse(localStorage.getItem('signals_history') || '[]')
      localStorage.setItem('signals_history', JSON.stringify([newSignal, ...history]))
      setHistoryReload(!historyReload)

    } catch {
      alert('Erro ao gerar análise do mercado')
    }
  }

  const removeSignal = (id) => {
    setSignals(prev => prev.filter(signal => signal.id !== id))
  }

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />

  return (
    <div className="min-h-screen-mobile p-4 mx-auto max-w-6xl">
      {/* Cabeçalho mantido igual */}
      
      <CurrencySelector selectedPair={selectedPair} setSelectedPair={setSelectedPair} />
      <TimeSelector selectedTime={selectedTime} setSelectedTime={setSelectedTime} />

      <div className="grid-mobile grid gap-4 md:gap-6 mt-6">
        {signals.map(signal => (
          <SignalDisplay 
            key={signal.id} 
            signal={signal} 
            onRemove={removeSignal}
          />
        ))}
      </div>

      <button 
        onClick={generateSignal}
        className="w-full bg-roxo text-branco font-orbitron py-3 rounded-lg neon-effect mt-6"
      >
        Gerar Novo Sinal ({3 - signals.length} restantes)
      </button>

      <History historyReload={historyReload} />

      <button
        onClick={() => {
          localStorage.removeItem('smoketrade_token')
          setLoggedIn(false)
        }}
        className="w-full mt-4 text-limao font-poppins hover:underline"
      >
        Sair
      </button>
    </div>
  )
}