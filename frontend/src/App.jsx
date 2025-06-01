import { useState, useEffect } from 'react';
// Importar getMarketAnalysis e isMarketOpen como checkMarketOpenStatus
import { getMarketAnalysis, isMarketOpen as checkMarketOpenStatus } from './lib/marketAnalysis';
import Login from './components/Login';
import CurrencySelector from './components/CurrencySelector';
import TimeSelector from './components/TimeSelector';
import SignalDisplay from './components/SignalDisplay';
import History from './components/History';
import BankManagement from './components/BankManagement';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [selectedTime, setSelectedTime] = useState(1);
  const [signals, setSignals] = useState([]);
  const [historyReload, setHistoryReload] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [marketMessage, setMarketMessage] = useState('');
  // Este estado isMarketClosed agora vai refletir APENAS se o mercado está fechado por horário
  const [isMarketClosed, setIsMarketClosed] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('smoketrade_token');
    if(token) {
      setLoggedIn(true);
    }
  }, []); 

  // NOVO useEffect para verificar o status do mercado periodicamente
  // e atualizar o isMarketClosed e marketMessage quando o par muda ou o tempo passa
  useEffect(() => {
    const updateMarketStatus = () => {
        // *** CORREÇÃO AQUI: Passa selectedPair para checkMarketOpenStatus ***
        const currentlyMarketClosedByTime = !checkMarketOpenStatus(selectedPair);
        setIsMarketClosed(currentlyMarketClosedByTime); // true se fechado por horário, false caso contrário

        // Ajusta a marketMessage com base no status do tempo.
        if (currentlyMarketClosedByTime) {
            setMarketMessage('MERCADO FECHADO! A brasa real volta no domingo, por volta das 18h.');
        } else if (marketMessage.includes('Viagem Simulada') && !marketMessage.includes('MERCADO FECHADO')) { 
             // Se o mercado está aberto MAS a última mensagem era de "Viagem Simulada", mantém ela.
             // Isso ocorre se a API falhou para um par que está aberto, por exemplo.
             // Garante que não sobreponha uma mensagem de mercado fechado.
        } else {
            // Se o mercado está aberto E não há uma mensagem de simulação ativa, limpa a mensagem.
            setMarketMessage(''); 
        }
    };

    // Executa uma vez na montagem E toda vez que o par selecionado mudar
    updateMarketStatus();

    // Configura um intervalo para verificar a cada minuto (ou outro período)
    const intervalId = setInterval(updateMarketStatus, 60 * 1000); // A cada 1 minuto

    // Limpa o intervalo quando o componente é desmontado ou o par selecionado muda
    return () => clearInterval(intervalId);
  }, [selectedPair]); // selectedPair como dependência. marketMessage é gerenciado internamente pela lógica.


  // Nova função para limpar os sinais ativos quando o histórico for limpo
  const clearActiveSignals = () => {
    setSignals([]);
  };

  const generateSignal = async () => {
    // Se o botão está desabilitado por horário (isMarketClosed === true), alerta e sai.
    // Para pares OTC/Cripto (que não fecham), isMarketClosed será false, permitindo a geração (simulados ou reais).
    if (isMarketClosed) {
        alert("O mercado está fechado. A brasa real volta no domingo, por volta das 18h.");
        return;
    }

    if(signals.length >= 3) {
      alert('Limite máximo de 3 sinais simultâneos!');
      return;
    }

    // Limpa a mensagem de mercado/simulação ANTES de uma nova tentativa de geração.
    // Isso garante que cada nova tentativa de sinal comece "limpa" em termos de mensagens.
    setMarketMessage(''); 
    // isMarketClosed não é resetado aqui, ele é controlado pelo useEffect periódico que usa selectedPair.

    try {
      // getMarketAnalysis retorna um objeto { analysis, direction, isReal, isMarketClosed }
      // analysisMarketClosedByTime é true APENAS se o marketAnalysis detectou mercado fechado por horário.
      const { analysis, direction, isReal, isMarketClosed: analysisMarketClosedByTime } = await getMarketAnalysis(selectedPair);

      // Atualiza a mensagem de mercado com base no que marketAnalysis retornou
      if (analysisMarketClosedByTime) { // Se a análise disse que o mercado está fechado por horário
        setMarketMessage(analysis); // (Ex: "MERCADO FECHADO!")
        setIsMarketClosed(true); // Garante que o botão continue desabilitado
      } else if (!isReal) { // Se o sinal é simulado por outros motivos (API esgotada ou par não mapeado/OTC)
        // A linha abaixo foi removida para eliminar a mensagem de aviso de "Viagem Simulada"
        // setMarketMessage(`Aviso: Viagem Simulada para ${selectedPair}. Dados reais indisponíveis agora.`);
        setMarketMessage(''); // Limpa a mensagem se for simulado e não for por mercado fechado
        setIsMarketClosed(false); // O botão NÃO deve ser desabilitado, pois não é um fechamento de mercado por horário
      } else { // Se o sinal é real (dados da API recebidos com sucesso)
        setMarketMessage(''); // Limpa qualquer mensagem de aviso
        setIsMarketClosed(false); // Garante que o botão esteja habilitado
      }
      
      const token = localStorage.getItem('smoketrade_token');
      
      // *** CORREÇÃO CRÍTICA AQUI: Usar VITE_API_URL para a requisição POST ***
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          pair: selectedPair,
          analysis: analysis,
          direction: direction,
          duration: selectedTime,
          isRealSignal: isReal, 
          isMarketClosedSignal: analysisMarketClosedByTime 
        })
      });

      if (response.ok) {
        const newSignal = await response.json();
        setSignals(prev => [...prev, {
          ...newSignal,
          analysis: analysis,
          direction: direction,
          timestamp: new Date(newSignal.timestamp).toLocaleString()
        }]);
        setHistoryReload(!historyReload);
      } else {
        const errorData = await response.json();
        console.error('Erro ao gerar sinal (Backend response):', errorData);
        alert(`Erro ao gerar sinal: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao gerar análise do mercado ou salvar sinal (Frontend error):', error);
      alert('Erro ao gerar análise do mercado. Verifique o console para mais detalhes.');
    }
  }

  const removeSignal = async (signalIdToRemove) => {
    try {
      const token = localStorage.getItem('smoketrade_token');
      // Já estava usando VITE_API_URL aqui, o que é correto
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signals/${signalIdToRemove}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        },
        credentials: 'include'
      });

      if (response.ok) {
        setSignals(prev => prev.filter(signal => signal._id !== signalIdToRemove));
        console.log(`Sinal ativo com ID ${signalIdToRemove} removido com sucesso do frontend.`);
        setHistoryReload(prev => !prev);
      } else {
        setSignals(prev => prev.filter(signal => signal._id !== signalIdToRemove));
        console.error('Falha ao remover sinal ativo do backend:', response.statusText);
      }
    } catch (err) {
      console.error('Erro ao remover sinal ativo (Frontend error):', err);
    }
  }

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />

  return (
    <div className="min-h-screen-mobile p-4 mx-auto max-w-6xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl text-limao font-orbitron mb-2">
          SmokeTrade IA
        </h1>
        <p className="text-branco font-poppins">
          Plataforma avançada de sinais de trading com inteligência artificial.
        </p>
      </header>

      <nav className="mb-8 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentPage('home')}
          className={`font-heading py-2 px-4 rounded-lg transition-colors duration-200
                      ${currentPage === 'home' ? 'bg-limao text-cinza' : 'text-limao hover:bg-cinza/30'}`}
        >
          Sinais Ativos
        </button>
        <button
          onClick={() => setCurrentPage('bank-management')}
          className={`font-heading py-2 px-4 rounded-lg transition-colors duration-200
                      ${currentPage === 'bank-management' ? 'bg-limao text-cinza' : 'text-limao hover:bg-cinza/30'}`}
        >
          Gerenciar Banca
        </button>
      </nav>
      
      {/* Exibe a mensagem de mercado/simulação */}
      {marketMessage && (
        <div className={`p-3 rounded-lg mb-4 text-center font-body text-sm ${isMarketClosed ? 'bg-vermelho/20 text-vermelho' : 'bg-roxo/20 text-roxo'}`}>
          {marketMessage}
        </div>
      )}

      {currentPage === 'home' && (
        <>
          <CurrencySelector selectedPair={selectedPair} setSelectedPair={setSelectedPair} />
          <TimeSelector selectedTime={selectedTime} setSelectedTime={setSelectedTime} />

          <div className="grid-mobile grid gap-4 md:gap-6 mt-6">
            {signals.map(signal => (
              <SignalDisplay 
                key={signal._id} 
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
            // Desabilita o botão APENAS se o mercado estiver fechado POR HORÁRIO.
            // Para pares OTC ou com falha de API, o botão permanecerá ativo para gerar simulados.
            disabled={isMarketClosed} 
          >
            {isMarketClosed ? 'MERCADO FECHADO' : `Gerar Sinal (${3 - signals.length} restantes)`}
          </button>

          <History 
            historyReload={historyReload} 
            onClearActiveSignals={clearActiveSignals} 
          />
        </>
      )}

      {currentPage === 'bank-management' && (
        <BankManagement />
      )}

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