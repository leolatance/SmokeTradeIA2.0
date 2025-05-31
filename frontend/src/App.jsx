import { useState, useEffect } from 'react'
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
    if(token) {
      setLoggedIn(true)
    }
  }, [])

  const generateSignal = async () => {
    if(signals.length >= 3) {
      alert('Limite máximo de 3 sinais simultâneos!')
      return
    }

    try {
      const analysis = await getMarketAnalysis(selectedPair)
      const token = localStorage.getItem('smoketrade_token')
      
      const response = await fetch('http://localhost:5000/api/signals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          pair: selectedPair,
          analysis: analysis,
          direction: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
          duration: selectedTime
        })
      });

      if (response.ok) {
        const newSignal = await response.json();
        setSignals(prev => [...prev, {
          ...newSignal,
          timestamp: new Date(newSignal.timestamp).toLocaleString()
        }]);
        setHistoryReload(!historyReload);
      } else {
        alert('Erro ao gerar sinal');
      }
    } catch {
      alert('Erro ao gerar análise do mercado');
    }
  }

  const removeSignal = (id) => {
    setSignals(prev => prev.filter(signal => signal.id !== id))
  }

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />

  return (
    <div className="min-h-screen-mobile p-4 mx-auto max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl text-limao font-orbitron mb-2">
          SmokeTrade
        </h1>
        <p className="text-branco font-poppins">
          Plataforma avançada de sinais de trading
        </p>
      </header>
      
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
        className="w-full bg-roxo text-branco font-heading py-3 rounded-lg 
                  hover:bg-roxo/90 transition-all duration-200
                  focus:ring-2 focus:ring-limao mt-6"
      >
        Gerar Sinal ({3 - signals.length} restantes)
      </button>

      <History historyReload={historyReload} />

      <a
        href="https://www.homebroker.com/ref/lTMcnb9N/"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full mt-6 text-center bg-limao text-cinza font-heading py-3 rounded-lg
                   hover:bg-limao/80 transition-colors duration-200 shadow-md"
      >
        Acesse a Corretora
      </a>

      <button
        onClick={() => {
          localStorage.removeItem('smoketrade_token')
          setLoggedIn(false)
        }}
        className="w-full mt-4 text-limao font-body hover:text-roxo 
                  hover:underline transition-colors duration-200"
      >
        Sair
      </button>
    </div>
  )
}