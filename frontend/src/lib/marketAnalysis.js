// Array de chaves da Alpha Vantage para tentar em sequência
const ALPHA_VANTAGE_KEYS = [
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_1,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_2,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_3,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_4,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_5,
  import.meta.env.VITE_ALPHA_VANTAGE_KEY_6,
].filter(Boolean);

// Padrões históricos por par - Mantenha, são úteis como fallback e para limites do RSI
const MARKET_PROFILES = {
  'EUR/USD': { min: 35, max: 65, volatility: 0.8 },
  'GBP/JPY': { min: 30, max: 70, volatility: 1.2 },
  'USD/JPY': { min: 33, max: 67, volatility: 0.9 },
  'BTC/USD': { min: 25, max: 75, volatility: 1.8 },
  'BTC/OTC': { min: 20, max: 80, volatility: 2.0 },
  'ETH/EUR': { min: 28, max: 72, volatility: 1.5 },
  'XAU/USD': { min: 32, max: 68, volatility: 1.0 },
};

/**
 * Verifica se o mercado está aberto para um determinado par.
 * Pares que não possuem símbolo mapeado são tratados como 24/7 (sempre abertos, mas simulados).
 * Para outros pares, usa a lógica 24/5 de Forex/Cripto de bolsa.
 */
export function isMarketOpen(pair) {
  const cryptoPairs24_7 = ['BTC/USD', 'ETH/EUR'];
  const otcOrUnmappedPairs = ['BTC/OTC'];

  if (cryptoPairs24_7.includes(pair) || otcOrUnmappedPairs.includes(pair)) {
    return true;
  }

  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const utcHour = now.getUTCHours();

  if (dayOfWeek === 0) { // Domingo
    return utcHour >= 21;
  }
  if (dayOfWeek === 6) { // Sábado
    return false;
  }
  if (dayOfWeek === 5) { // Sexta-feira
    return utcHour < 21;
  }

  return true;
}


export async function getMarketAnalysis(pair) {
  const symbol = convertPairToSymbol(pair);
  const interval = '30min'; // Intervalo para todos os indicadores
  const timePeriodRSI = 14;
  const timePeriodEMA20 = 20; // EMA de 20 períodos
  const timePeriodEMA50 = 50; // NOVO: EMA de 50 períodos
  const timePeriodADX = 14;

  const marketOpen = isMarketOpen(pair);

  if (!marketOpen) { 
    console.warn(`MERCADO FECHADO para ${pair}. Rolando um sinal simulado.`);
    return {
      analysis: `MERCADO FECHADO! A brasa real volta no domingo, por volta das 18h.`,
      direction: Math.random() > 0.5 ? 'COMPRA' : 'VENDA',
      isReal: false,
      isMarketClosed: true
    };
  }

  if (!symbol || ALPHA_VANTAGE_KEYS.length === 0) { 
    console.warn(`Símbolo ${pair} não mapeado ou sem chaves de API válidas. Rolando um simulado.`);
    return { ...generateSimulatedAnalysis(pair), isReal: false, isMarketClosed: false }; 
  }

  for (const apiKey of ALPHA_VANTAGE_KEYS) {
    if (!apiKey) {
        console.warn("Sem chave na seda, pulando para a próxima.");
        continue;
    }

    try {
      let rsiData, ema20Data, ema50Data, adxData; // NOVO: ema50Data
      let rsi, ema20, ema50, adx; // NOVO: ema50
      let dataIncomplete = false;

      // --- 1. Busca RSI ---
      const rsiUrl = `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=${interval}&time_period=${timePeriodRSI}&series_type=close&apikey=${apiKey}`;
      const rsiResponse = await fetch(rsiUrl);
      rsiData = await rsiResponse.json();

      if (rsiData['Note']?.includes('API call frequency') || rsiData['Information']?.includes('invalid API key')) {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Fumaça demais ou chave queimada. Tentando a próxima brasa.`);
        continue;
      }
      const latestRSIEntry = rsiData['Technical Analysis: RSI'] ? Object.entries(rsiData['Technical Analysis: RSI'])[0] : null;
      if (latestRSIEntry && latestRSIEntry[1]?.RSI) {
        rsi = parseFloat(latestRSIEntry[1].RSI);
      } else {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Cinza no RSI para ${pair}.`);
        dataIncomplete = true;
      }

      // --- 2. Busca EMA20 ---
      const ema20Url = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=${interval}&time_period=${timePeriodEMA20}&series_type=close&apikey=${apiKey}`;
      const ema20Response = await fetch(ema20Url);
      ema20Data = await ema20Response.json();

      if (ema20Data['Note']?.includes('API call frequency') || ema20Data['Information']?.includes('invalid API key')) {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Fumaça demais ou chave queimada. Tentando a próxima brasa.`);
        continue;
      }
      const latestEMA20Entry = ema20Data['Technical Analysis: EMA'] ? Object.entries(ema20Data['Technical Analysis: EMA'])[0] : null;
      if (latestEMA20Entry && latestEMA20Entry[1]?.EMA) {
        ema20 = parseFloat(latestEMA20Entry[1].EMA);
      } else {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Cinza na EMA20 para ${pair}.`);
        dataIncomplete = true;
      }

      // --- 3. Busca EMA50 (NOVO) ---
      const ema50Url = `https://www.alphavantage.co/query?function=EMA&symbol=${symbol}&interval=${interval}&time_period=${timePeriodEMA50}&series_type=close&apikey=${apiKey}`;
      const ema50Response = await fetch(ema50Url);
      ema50Data = await ema50Response.json();

      if (ema50Data['Note']?.includes('API call frequency') || ema50Data['Information']?.includes('invalid API key')) {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Fumaça demais ou chave queimada. Tentando a próxima brasa.`);
        continue;
      }
      const latestEMA50Entry = ema50Data['Technical Analysis: EMA'] ? Object.entries(ema50Data['Technical Analysis: EMA'])[0] : null;
      if (latestEMA50Entry && latestEMA50Entry[1]?.EMA) {
        ema50 = parseFloat(latestEMA50Entry[1].EMA);
      } else {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Cinza na EMA50 para ${pair}.`);
        dataIncomplete = true;
      }

      // --- 4. Busca ADX ---
      const adxUrl = `https://www.alphavantage.co/query?function=ADX&symbol=${symbol}&interval=${interval}&time_period=${timePeriodADX}&apikey=${apiKey}`;
      const adxResponse = await fetch(adxUrl);
      adxData = await adxResponse.json();

      if (adxData['Note']?.includes('API call frequency') || adxData['Information']?.includes('invalid API key')) {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Fumaça demais ou chave queimada. Tentando a próxima brasa.`);
        continue;
      }
      const latestADXEntry = adxData['Technical Analysis: ADX'] ? Object.entries(adxData['Technical Analysis: ADX'])[0] : null;
      if (latestADXEntry && latestADXEntry[1]?.ADX) {
        adx = parseFloat(latestADXEntry[1].ADX);
      } else {
        console.warn(`[Key ${apiKey.substring(0, 5)}...] Cinza no ADX para ${pair}.`);
        dataIncomplete = true;
      }

      if (dataIncomplete || rsi === undefined || ema20 === undefined || ema50 === undefined || adx === undefined) { 
          console.warn(`[Key ${apiKey.substring(0, 5)}...] Bolo de dados incompleto para ${pair}. Tentando a próxima brasa.`);
          continue;
      }
        
      const currentPriceEstimate = ema20; // Ainda usando EMA20 como estimativa para a lógica principal
      
      // Passa ema50 para a função de análise combinada
      return { ...generateCombinedAnalysis(rsi, ema20, ema50, adx, currentPriceEstimate, pair), isReal: true, isMarketClosed: false }; 

    } catch (error) {
      console.error(`[Key ${apiKey.substring(0, 5)}...] Erro na fumaça com esta chave para ${pair}:`, error);
      continue;
    }
  }

  console.warn("Todas as brasa se apagaram. Rolando um sinal simulado.");
  return { ...generateSimulatedAnalysis(pair), isReal: false, isMarketClosed: false }; 
}

function convertPairToSymbol(pair) {
  const symbolMap = {
    'EUR/USD': 'EURUSD',
    'GBP/JPY': 'GBPJPY',
    'USD/JPY': 'USDJPY',
    'BTC/USD': 'BTCUSD',
    'ETH/EUR': 'ETHEUR',
    'XAU/USD': 'XAUUSD',
  };
  return symbolMap[pair] || null;
}

// Nova função para gerar análise combinada - AGORA SEMPRE RETORNA UMA DIREÇÃO
function generateCombinedAnalysis(rsi, ema20, ema50, adx, currentPrice, pair) { // NOVO: ema50 como parâmetro
  const profile = MARKET_PROFILES[pair] || { min: 30, max: 70, volatility: 1 };
  const ADX_TREND_THRESHOLD = 25; // Nível para considerar uma tendência forte

  let analysis = `${pair} (RSI: ${rsi.toFixed(1)}, EMA20: ${ema20.toFixed(3)}, EMA50: ${ema50.toFixed(3)}, ADX: ${adx.toFixed(1)}) - `; // Adicionado EMA50 no texto
  let direction = '';

  // Lógica de cruzamento de EMAs para confirmar tendência forte
  const goldenCross = ema20 > ema50 && currentPrice > ema50; // Sinal de alta (EMA menor acima da maior, preço acima das duas)
  const deathCross = ema20 < ema50 && currentPrice < ema50; // Sinal de baixa (EMA menor abaixo da maior, preço abaixo das duas)

  if (adx > ADX_TREND_THRESHOLD) { // Se a fumaça tá subindo ou descendo forte
    if (goldenCross) {
      analysis += 'CRUZAMENTO DOURADO! TENDÊNCIA DE ALTA CONFIRMADA. Hora de COBRIR PESADO!';
      direction = 'COMPRA';
    } else if (deathCross) {
      analysis += 'CRUZAMENTO DA MORTE! TENDÊNCIA DE BAIXA CONFIRMADA. Hora de VENDER TUDO!';
      direction = 'VENDA';
    } else if (currentPrice > ema20) { // Ainda em tendência de alta (preço acima da EMA20)
      analysis += 'A LENHA TÁ QUENTE! Fumaça subindo forte, hora de COBRIR.';
      direction = 'COMPRA';
    } else if (currentPrice < ema20) { // Ainda em tendência de baixa (preço abaixo da EMA20)
      analysis += 'O FOGO TÁ BAIXO! Fumaça descendo forte, hora de VENDER O PAU.';
      direction = 'VENDA';
    } else { // Tendência forte, mas sem um claro alinhamento de EMAs/Preço
        if (rsi >= 50) {
            analysis += 'FUMAÇA FORTE, mas com direção indefinida. Momentum ALTA, ir devagar.';
            direction = 'COMPRA';
        } else {
            analysis += 'FUMAÇA FORTE, mas com direção indefinida. Momentum BAIXA, ir devagar.';
            direction = 'VENDA';
        }
    }
  } else { // Se o ambiente tá sem vento, ou a brasa tá fraca (lateralizado)
    if (rsi < profile.min && currentPrice < ema20) { // RSI sobrevendido E preço abaixo da EMA (sugere reversão de baixa ou forte queda)
      analysis += 'BRASA FRIA! SOBREVENDIDO, Potencial reversão para ALTA. Dar um TRAGO FORTE!';
      direction = 'COMPRA';
    } else if (rsi > profile.max && currentPrice > ema20) { // RSI sobrecomprado E preço acima da EMA (sugere reversão de alta ou forte alta)
      analysis += 'BRASA QUENTE! SOBRECOMPRADO, Potencial reversão para BAIXA. Soltar a FUMAÇA!';
      direction = 'VENDA';
    } else {
      // Se não há sinal forte nem RSI extremo, force uma direção baseada no RSI central
      if (rsi >= 50) {
        analysis += 'FUMAÇA MÉDIA. Mas o vento está a favor da ALTA. Hora de SUBIR!';
        direction = 'COMPRA';
      } else {
        analysis += 'FUMAÇA MÉDIA. Mas o vento está a favor da BAIXA. Hora de DESCER!';
        direction = 'VENDA';
      }
    }
  }
  
  return { analysis, direction, isReal: true };
}

// Adaptação da função generateAnalysisFromRSI para o fallback
function generateAnalysisFromRSI(rsi, pair, isReal = false) {
  const profile = MARKET_PROFILES[pair] || { min: 30, max: 70 };
  let analysis;
  let direction; 

  if (rsi > profile.max + 5) { 
    analysis = `${pair} MUITO SOBRECOMPRADO (RSI ${rsi.toFixed(1)}) - O POTE TÁ MUITO CHEIO! Hora da BAIXA.`;
    direction = 'VENDA';
  } else if (rsi > profile.max) {
    analysis = `${pair} SOBRECOMPRADO (RSI ${rsi.toFixed(1)}) - Pote cheio, prepara pra BAIXA.`;
    direction = 'VENDA';
  } else if (rsi < profile.min - 5) {
    analysis = `${pair} MUITO SOBREVENDIDO (RSI ${rsi.toFixed(1)}) - POTE VAZIO! Hora da ALTA.`;
    direction = 'COMPRA';
  } else if (rsi < profile.min) {
    analysis = `${pair} SOBREVENDIDO (RSI ${rsi.toFixed(1)}) - Pote quase vazio, prepara pra ALTA.`;
    direction = 'COMPRA';
  } else {
    if (rsi >= 50) {
      analysis = `${pair} em equilíbrio (RSI ${rsi.toFixed(1)}) - Brisa leve pra CIMA.`;
      direction = 'COMPRA';
    } else {
      analysis = `${pair} em equilíbrio (RSI ${rsi.toFixed(1)}) - Brisa leve pra BAIXO.`;
      direction = 'VENDA';
    }
  }

  return { analysis: analysis + (isReal ? ' [Análise por IA]' : ' [Análise Histórica Matemática]'), direction, isReal };
}

// Adaptação da função generateSimulatedAnalysis para o fallback
function generateSimulatedAnalysis(pair) {
  const profile = MARKET_PROFILES[pair] || { min: 30, max: 70, volatility: 1 };
  const baseRSI = (profile.min + profile.max) / 2;
  const rsi = baseRSI + (Math.random() * (100 - 0) * 0.5 - (100 - 0) * 0.25); 

  return generateAnalysisFromRSI(
    Math.min(Math.max(rsi, 0), 100),
    pair, 
    false
  );
}