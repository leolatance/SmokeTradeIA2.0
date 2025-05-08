export default function CurrencySelector({ selectedPair, setSelectedPair }) {
  const pairs = [
    'EUR/USD', 
    'GBP/JPY', 
    'USD/JPY',
    'EUR/GBP',
    'BTC/USD', 
    'BTC/OTC',
    'ETH/EUR', 
    'XAU/USD',
    'APPLE/OTC'
  ]

  return (
    <div className="bg-cinza p-4 rounded-lg">
      <h3 className="text-branco font-poppins mb-2">Selecione o Par</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {pairs.map(pair => (
          <button
            key={pair}
            onClick={() => setSelectedPair(pair)}
            className={`p-2 text-sm md:text-base rounded ${
              selectedPair === pair ? 'bg-limao text-fundo' : 'bg-fundo text-branco'
            } font-poppins transition-all duration-200 hover:scale-105`}
          >
            {pair}
          </button>
        ))}
      </div>
    </div>
  )
}