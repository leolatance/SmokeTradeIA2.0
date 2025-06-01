import { useEffect, useState } from 'react';

export default function History({ historyReload, onClearActiveSignals }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('smoketrade_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signals`, {
          headers: {
            'x-auth-token': token
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          const errorData = await response.json(); 
          console.error('Falha ao buscar histórico do backend:', errorData);
          if (errorData.message === 'Token inválido' && window.location.pathname !== '/') { 
              localStorage.removeItem('smoketrade_token');
              alert('Sua sessão expirou. Por favor, faça login novamente.');
              window.location.href = '/'; 
          }
        }
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      }
    };

    fetchHistory();
  }, [historyReload]);

  const handleRemoveSignal = async (signalId) => {
    try {
      const token = localStorage.getItem('smoketrade_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signals/${signalId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        },
        credentials: 'include'
      });

      if (response.ok) {
        setHistory(prevHistory => prevHistory.filter(signal => signal._id !== signalId));
        console.log(`Sinal ${signalId} removido do histórico com sucesso.`);
      } else {
        const errorData = await response.json(); 
        console.error('Falha ao remover sinal do histórico (Backend response):', errorData);
        if (errorData.message === 'Token inválido' && window.location.pathname !== '/') {
            localStorage.removeItem('smoketrade_token');
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/';
        }
      }
    } catch (err) {
      console.error('Erro ao remover sinal:', err);
    }
  };

  const handleClearHistory = async () => {
    try {
      const token = localStorage.getItem('smoketrade_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signals`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        setHistory([]);
        if (onClearActiveSignals) {
          onClearActiveSignals();
          console.log('Sinais ativos também foram limpos no frontend.');
        }
        console.log('Histórico limpo com sucesso no frontend e backend.');
      } else {
        const errorData = await response.json(); 
        console.error('Falha ao limpar histórico no backend:', errorData);
        if (errorData.message === 'Token inválido' && window.location.pathname !== '/') {
            localStorage.removeItem('smoketrade_token');
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            window.location.href = '/';
        }
      }
    } catch (err) {
      console.error('Erro ao limpar histórico:', err);
    }
  };

  return (
    <div className="bg-cinza p-4 rounded-lg mt-6">
      <h3 className="text-limao font-heading text-xl mb-4">Histórico de Sinais</h3>
      
      {history.length === 0 ? (
        <p className="text-branco font-body">Nenhum sinal gerado ainda</p>
      ) : (
        <div className="space-y-3">
          {history.map((signal) => (
            <div key={signal._id} className="bg-fundo p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-heading text-branco">{signal.pair}</span>
                  <p className="text-sm text-branco/70 font-body">{signal.timestamp}</p>
                </div>
                <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-lg ${
                      signal.direction === 'COMPRA' 
                        ? 'bg-limao/20 text-limao' 
                        : 'bg-vermelho/20 text-vermelho'
                    } font-body text-sm mr-2`}>
                      {signal.direction}
                    </span>
                    <button
                        onClick={() => handleRemoveSignal(signal._id)}
                        className="text-roxo hover:text-limao text-sm md:text-base transition-colors"
                    >
                        ✕
                    </button>
                </div>
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