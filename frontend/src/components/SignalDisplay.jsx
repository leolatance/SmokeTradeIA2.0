import { useState, useEffect } from 'react'

export default function SignalDisplay({ signal, onRemove }) {
  // Usamos signal._id para o ID que será passado para onRemove
  // e signal.duration para o timeLeft
  const [timeLeft, setTimeLeft] = useState(signal.duration * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if(prev <= 1) {
          clearInterval(timer)
          // Passa signal._id para a função onRemove
          onRemove(signal._id) 
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onRemove, signal._id]) // Adicionado signal._id aqui para a dependência do useEffect

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-cinza p-4 md:p-6 rounded-lg relative animate-pulse">
      <button
        // Passa signal._id para a função onRemove ao clicar
        onClick={() => onRemove(signal._id)}
        className="absolute top-2 right-2 text-roxo hover:text-limao text-sm md:text-base transition-colors"
      >
        ✕
      </button>
      
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-branco font-body text-sm md:text-base">Par:</span>
          <span className="text-limao font-heading text-sm md:text-base max-w-[50%] truncate">
            {signal.pair}
          </span>
        </div>

        {/* Nova seção de entrada adicionada aqui */}
        <div className="flex justify-between items-start">
          <span className="text-branco font-body text-sm md:text-base">Entre em:</span>
          <span className="text-limao font-heading text-sm md::text-base">
            {signal.timestamp}
          </span>
        </div>

        <div className="text-center">
          <p className={`text-2xl md:text-3xl font-heading ${
            signal.direction === 'VENDA' || signal.direction === 'PUT' 
              ? 'text-vermelho' 
              : 'text-limao'
          }`}>
            {signal.direction}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-branco font-body text-xs md:text-sm">Análise da IA:</p>
          <p className="text-roxo/80 italic text-xs md:text-sm leading-tight font-body">
            "{signal.analysis}"
          </p>
        </div>
      </div>
    </div>
  )
}