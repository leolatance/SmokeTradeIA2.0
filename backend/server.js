require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const signalRoutes = require('./routes/signals');

const app = express();

// Configuração CORRETA e centralizada do CORS
const corsOptions = {
  origin: [
    'http://localhost:5173', // Frontend local
    'https://smoke-trade-ia-2-0.vercel.app', // Seu domínio na Vercel (sem a barra final é mais seguro)
    // Se você tiver um domínio customizado no Vercel, adicione-o aqui também:
    // 'https://seunomedominiocustomizado.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Inclua OPTIONS para requisições preflight
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], // CORRIGIDO: array de strings com todos os headers
  credentials: true
};

// Middlewares
app.use(cors(corsOptions)); // Aplicar as opções corretas GLOBALMENTE
app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro na conexão:', err));

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: "🚀 SmokeTrade Backend API",
    status: "operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      auth: {
        login: "POST /api/auth/login",
        // test: "GET /api/auth/test" // Removido, não vejo essa rota em auth.js
      },
      signals: {
        create: "POST /api/signals",
        history: "GET /api/signals",
        clear: "DELETE /api/signals",
        deleteSpecific: "DELETE /api/signals/:id" // Adicionado para clareza
      }
    }
  });
});

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime().toFixed(2) + ' seconds',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/signals', signalRoutes);

// Rota de fallback para 404
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.url,
    method: req.method,
    suggestion: "Acesse / para ver os endpoints disponíveis"
  });
});

// Tratamento centralizado de erros
app.use((err, req, res, next) => {
  console.error('⚠️ Erro no servidor:', err);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: err.message
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // Usar 0.0.0.0 para que o servidor seja acessível externamente no Render

app.listen(PORT, HOST, () => {
  console.log('================================================');
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`🟢 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Endpoint raiz: http://localhost:${PORT}/`);
  console.log('================================================');
  console.log('Configurações:');
  console.log(`- Porta: ${PORT}`);
  console.log(`- MongoDB: ${process.env.MONGODB_URI ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  console.log('================================================');
});