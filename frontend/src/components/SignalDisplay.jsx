import { useState, useEffect } from 'react'

export default function SignalDisplay({ signal, onRemove }) {
  const [timeLeft, setTimeLeft] = useState(signal.duration * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if(prev <= 1) {
          clearInterval(timer)
          onRemove(signal.id)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onRemove, signal.id])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-cinza p-4 md:p-6 rounded-lg relative animate-pulse">
      <button
        onClick={() => onRemove(signal.id)}
        className="absolute top-2 right-2 text-roxo hover:text-limao text-sm md:text-base"
      >
        ✕
      </button>
      
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-branco font-poppins text-sm md:text-base">Par:</span>
          <span className="text-limao font-orbitron text-sm md:text-base max-w-[50%] truncate">
            {signal.pair}
          </span>
        </div>

        <div className="text-center">
          <p className="text-2xl md:text-3xl font-orbitron text-limao">
            {signal.direction}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-branco font-poppins text-xs md:text-sm">Análise Técnica:</p>
          <p className="text-roxo italic text-xs md:text-sm leading-tight">
            "{signal.analysis}"
          </p>
        </div>

        <div className="pt-2 border-t border-roxo/30">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-branco/80">Expira em:</span>
            <span className="text-limao">{formatTime(timeLeft)}</span>
          </div>
          <div className="h-1.5 md:h-2 bg-roxo/20 rounded-full mt-2">
            <div 
              className="h-full bg-limao rounded-full transition-all"
              style={{ width: `${(timeLeft / (signal.duration * 60)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}