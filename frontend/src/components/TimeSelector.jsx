export default function TimeSelector({ selectedTime, setSelectedTime }) {
    const times = [1, 2, 3, 5, 15]
  
    return (
      <div className="bg-cinza p-4 rounded-lg mt-4">
        <h3 className="text-branco font-poppins mb-2">Tempo de Expiração</h3>
        <div className="grid grid-cols-3 gap-2">
          {times.map(time => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-2 rounded ${
                selectedTime === time ? 'bg-roxo text-branco' : 'bg-fundo text-branco'
              } font-poppins neon-effect`}
            >
              {time} min
            </button>
          ))}
        </div>
      </div>
    )
  }