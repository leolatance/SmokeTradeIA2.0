require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const signalRoutes = require('./routes/signals');

const app = express();

// Configuração de CORS mais permissiva para desenvolvimento
app.use(cors({
  origin: '*', // Permite todas as origens (em produção, restrinja!)
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));

app.use(express.json());

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => {
    console.error('❌ Erro na conexão com MongoDB:', err.message);
    console.log('Verifique:');
    console.log('1. Sua string de conexão MONGODB_URI no .env');
    console.log('2. Se seu IP está autorizado no MongoDB Atlas');
    console.log('3. Se o cluster está ativo no MongoDB Atlas');
  });

// Middleware de log para todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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
      }
    }
  });
});

// Rota de saúde
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'online',
    database: dbStatus,
    uptime: `${process.uptime().toFixed(2)} seconds`,
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

// Configuração do servidor
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // Importante para aceitar conexões externas

app.listen(PORT, HOST, () => {
  console.log('================================================');
  console.log(`🚀 Servidor iniciado em http://${HOST}:${PORT}`);
  console.log(`🟢 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Endpoint raiz: http://localhost:${PORT}/`);
  console.log('================================================');
  console.log('Configurações:');
  console.log(`- Porta: ${PORT}`);
  console.log(`- MongoDB: ${process.env.MONGODB_URI ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  console.log('================================================');
});