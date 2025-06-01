export default function CurrencySelector({ selectedPair, setSelectedPair }) {
  const pairs = [
    'EUR/USD',
    'GBP/JPY',
    'USD/JPY',
    'EUR/GBP',
    'BTC/USD',
    'BTC/OTC', // <-- Manter BTC/OTC aqui para que o usuário possa selecioná-lo
    'ETH/EUR',
    'XAU/USD',
    // 'APPLE/OTC' // <-- REMOVIDO, pois não é bem suportado pela Alpha Vantage gratuita para indicadores
  ]

  return (
    <div className="bg-cinza p-4 rounded-lg">
      <h3 className="text-branco font-heading mb-2">Selecione o Par</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {pairs.map(pair => (
          <button
            key={pair}
            onClick={() => setSelectedPair(pair)}
            className={`p-2 text-sm md:text-base rounded ${
              selectedPair === pair 
                ? 'bg-limao text-fundo font-bold' 
                : 'bg-fundo text-branco hover:bg-roxo/20'
            } font-body transition-all duration-200 active:scale-95`}
          >
            {pair}
          </button>
        ))}
      </div>
    </div>
  )
}