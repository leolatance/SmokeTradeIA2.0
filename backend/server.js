require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const signalRoutes = require('./routes/signals');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB (atualizada para versão moderna)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro na conexão:', err));

// Rota raiz informativa
app.get('/', (req, res) => {
  res.json({
    message: "🚀 SmokeTrade Backend API",
    status: "operational",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        login: "POST /api/auth/login",
        test: "GET /api/auth/test"
      },
      signals: {
        create: "POST /api/signals",
        history: "GET /api/signals",
        clear: "DELETE /api/signals"
      },
      health: "GET /api/health"
    }
  });
});

// Rota de verificação de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime().toFixed(2) + ' seconds',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/signals', signalRoutes);

// Rota de fallback para 404
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    suggestion: "Verifique / para lista de endpoints disponíveis"
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🟢 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Endpoints disponíveis em http://localhost:${PORT}/`);
  console.log(`=================================`);
});