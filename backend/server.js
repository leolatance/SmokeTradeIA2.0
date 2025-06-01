require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const signalRoutes = require('./routes/signals');

const app = express();

// Configuração CORRETA do CORS
const corsOptions = {
  origin: [
    'http://localhost:5173', // Frontend local
    'https://seu-frontend-na-vercel.vercel.app' // Seu domínio na Vercel
  ],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], // CORRIGIDO: array de strings
  credentials: true
};

// Middlewares
app.use(cors(corsOptions)); // Aplicar as opções corretas
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
        test: "GET /api/auth/test"
      },
      signals: {
        create: "POST /api/signals",
        history: "GET /api/signals",
        clear: "DELETE /api/signals"
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
const HOST = '0.0.0.0';

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