import React, { useState, useEffect } from 'react';

// Valores padrão para o gerenciamento de banca (você pode ajustá-los)
const DEFAULT_RISK_PER_TRADE_PERCENT = 1;     // 1% de risco por operação
const DEFAULT_TARGET_WIN_PER_TRADE_PERCENT = 2; // 2% de ganho esperado por operação
const DEFAULT_DAILY_STOP_LOSS_PERCENT = 5;    // 5% de Stop Loss diário
const DEFAULT_DAILY_STOP_WIN_PERCENT = 10;    // 10% de Stop Win diário
const DEFAULT_MAX_SIGNALS_PER_DAY = 10;       // 10 sinais/operações por dia (para cálculos futuros se precisar)
const DEFAULT_PROJECTION_DAYS = 7;            // Projetar para 7 dias

export default function BankManagement() {
  const [initialBalance, setInitialBalance] = useState(() => {
    const savedBalance = localStorage.getItem('bank_management_initial_balance');
    return savedBalance ? parseFloat(savedBalance) : '';
  });

  const [projectedBalances, setProjectedBalances] = useState([]);

  // useEffect para carregar e salvar a banca inicial
  useEffect(() => {
    if (initialBalance !== '' && !isNaN(initialBalance)) {
      localStorage.setItem('bank_management_initial_balance', initialBalance.toString());
    } else if (initialBalance === '') {
      localStorage.removeItem('bank_management_initial_balance');
    }
    // Chamar a projeção sempre que a banca inicial mudar (e for válida)
    if (initialBalance > 0 && !isNaN(initialBalance)) {
      calculateProjections(initialBalance);
    } else {
      setProjectedBalances([]); // Limpa a projeção se a banca for inválida
    }
  }, [initialBalance]);

  // Função para calcular as projeções
  // Recebe a banca atual como argumento para ser reativa à mudança de initialBalance
  const calculateProjections = (balance) => {
    if (balance <= 0 || isNaN(balance)) {
      setProjectedBalances([]);
      return;
    }

    const projections = [];
    let currentBalance = parseFloat(balance); // Usa a banca passada como argumento

    for (let day = 1; day <= DEFAULT_PROJECTION_DAYS; day++) {
      // Cálculo simplificado: Assume que você atinge o stop win diário.
      const dailyGain = currentBalance * (DEFAULT_DAILY_STOP_WIN_PERCENT / 100);
      currentBalance += dailyGain;
      projections.push({
        day: day,
        balance: currentBalance.toFixed(2),
        dailyGain: dailyGain.toFixed(2)
      });
    }
    setProjectedBalances(projections);
  };

  // Cálculos derivados para exibição direta
  const riskValuePerTrade = (initialBalance * (DEFAULT_RISK_PER_TRADE_PERCENT / 100)).toFixed(2);
  const targetWinValuePerTrade = (initialBalance * (DEFAULT_TARGET_WIN_PER_TRADE_PERCENT / 100)).toFixed(2);
  const dailyStopLossValue = (initialBalance * (DEFAULT_DAILY_STOP_LOSS_PERCENT / 100)).toFixed(2);
  const dailyStopWinValue = (initialBalance * (DEFAULT_DAILY_STOP_WIN_PERCENT / 100)).toFixed(2);
  const gainPerSignal = (initialBalance * (DEFAULT_TARGET_WIN_PER_TRADE_PERCENT / 100)).toFixed(2); // Assumindo ganho por sinal = targetWinPerTrade

  return (
    <div className="bg-cinza p-4 rounded-lg mt-6">
      <h3 className="text-limao font-heading text-xl mb-4">Gerenciamento de Banca</h3>

      <div className="space-y-4 text-left">
        {/* Input de Banca Inicial */}
        <div className="flex flex-col mb-6"> {/* Adicionado mb-6 para mais espaçamento */}
          <label htmlFor="initialBalance" className="text-branco font-body text-sm mb-1">
            Minha Banca Inicial (R$)
          </label>
          <input
            type="number"
            id="initialBalance"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value === '' ? '' : parseFloat(e.target.value))}
            placeholder="Ex: 1000"
            className="p-2 rounded-md bg-fundo text-branco font-body focus:outline-none focus:ring-2 focus:ring-limao"
            min="0"
          />
        </div>

        {initialBalance > 0 && !isNaN(initialBalance) && (
          <div className="bg-fundo p-4 rounded-lg shadow-inner space-y-3">
            <h4 className="text-limao font-heading text-lg mb-2">Seus Parâmetros de Risco:</h4>
            
            {/* Informação de Entrada */}
            <p className="text-branco font-body text-base flex justify-between items-center bg-cinza p-2 rounded-md">
              <span className="font-heading text-limao">FAÇA A ENTRADA COM:</span>
              <span className="text-limao font-heading text-xl">R$ {riskValuePerTrade}</span>
            </p>
            {/* Fim da Informação de Entrada */}

            <p className="text-branco font-body text-sm flex justify-between">
              <span>Risco por Operação ({DEFAULT_RISK_PER_TRADE_PERCENT}%):</span>
              <span className="text-vermelho font-heading">R$ {riskValuePerTrade}</span>
            </p>
            <p className="text-branco font-body text-sm flex justify-between">
              <span>Ganho Alvo por Operação ({DEFAULT_TARGET_WIN_PER_TRADE_PERCENT}%):</span>
              <span className="text-limao font-heading">R$ {targetWinValuePerTrade}</span>
            </p>
            <p className="text-branco font-body text-sm flex justify-between">
              <span>Stop Loss Diário ({DEFAULT_DAILY_STOP_LOSS_PERCENT}%):</span>
              <span className="text-vermelho font-heading">R$ {dailyStopLossValue}</span>
            </p>
            <p className="text-branco font-body text-sm flex justify-between">
              <span>Stop Win Diário ({DEFAULT_DAILY_STOP_WIN_PERCENT}%):</span>
              <span className="text-limao font-heading">R$ {dailyStopWinValue}</span>
            </p>
            <p className="text-branco font-body text-sm flex justify-between">
              <span>Ganho Médio por Sinal:</span>
              <span className="text-limao font-heading">R$ {gainPerSignal}</span>
            </p>
            <p className="text-branco/70 text-xs mt-2">
              *Baseado em um ganho de {DEFAULT_TARGET_WIN_PER_TRADE_PERCENT}% por sinal.
            </p>
          </div>
        )}
      </div>

      {/* Seção de Projeção */}
      {projectedBalances.length > 0 && (
        <div className="mt-8">
          <h4 className="text-limao font-heading text-lg mb-3">Projeção de Banca (próximos {DEFAULT_PROJECTION_DAYS} dias)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-fundo rounded-lg shadow-md">
              <thead>
                <tr className="bg-fundo text-branco/80 text-sm font-body">
                  <th className="py-2 px-3 text-left">Dia</th>
                  <th className="py-2 px-3 text-left">Banca Projetada (R$)</th>
                  <th className="py-2 px-3 text-left">Ganho Diário (R$)</th>
                </tr>
              </thead>
              <tbody>
                {projectedBalances.map((proj, index) => (
                  <tr key={index} className="border-t border-cinza text-branco font-body text-sm">
                    <td className="py-2 px-3">{proj.day}</td>
                    <td className="py-2 px-3 text-limao">{proj.balance}</td>
                    <td className="py-2 px-3 text-limao">{proj.dailyGain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-branco/70 text-xs mt-4">
            *Essa projeção assume que você atinge o Stop Win Diário ({DEFAULT_DAILY_STOP_WIN_PERCENT}%) a cada dia.
            Resultados reais podem variar.
          </p>
        </div>
      )}
    </div>
  );
}