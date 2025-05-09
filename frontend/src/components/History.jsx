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
      <h3 className="text-limao font-heading text-xl mb-4">Histórico de Sinais</h3>
      
      {history.length === 0 ? (
        <p className="text-branco font-body">Nenhum sinal gerado ainda</p>
      ) : (
        <div className="space-y-3">
          {history.map((signal, index) => (
            <div key={index} className="bg-fundo p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-heading text-branco">{signal.pair}</span>
                  <p className="text-sm text-branco/70 font-body">{signal.timestamp}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg ${
                  signal.direction === 'COMPRA' 
                    ? 'bg-limao/20 text-limao' 
                    : 'bg-vermelho/20 text-vermelho'
                } font-body text-sm`}>
                  {signal.direction}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <button
          onClick={handleClearHistory}
          className="mt-4 text-roxo font-body hover:text-limao transition-colors duration-200"
        >
          Limpar Histórico
        </button>
      )}
    </div>
  )
}