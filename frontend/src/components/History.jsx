import { useEffect, useState } from 'react'

export default function History({ historyReload }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('signals_history') || '[]')
    setHistory(savedHistory)
  }, [historyReload])

  const handleClearHistory = () => {
    localStorage.removeItem('signals_history')
    setHistory([])
  }

  return (
    <div className="bg-cinza p-4 rounded-lg mt-6">
      <h3 className="text-limao font-orbitron text-xl mb-4">Histórico de Sinais</h3>
      
      {history.length === 0 ? (
        <p className="text-branco font-poppins">Nenhum sinal gerado ainda</p>
      ) : (
        <div className="space-y-3">
          {history.map((signal, index) => (
            <div key={index} className="bg-fundo p-3 rounded-lg">
              <div className="flex justify-between font-poppins">
                <span className="text-branco">{signal.pair}</span>
                <span className={`${signal.direction === 'CALL' ? 'text-limao' : 'text-roxo'}`}>
                  {signal.direction}
                </span>
              </div>
              <p className="text-sm text-branco opacity-80">{signal.timestamp}</p>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <button
          onClick={handleClearHistory}
          className="mt-4 text-roxo font-poppins hover:text-limao transition"
        >
          Limpar Histórico
        </button>
      )}
    </div>
  )
}