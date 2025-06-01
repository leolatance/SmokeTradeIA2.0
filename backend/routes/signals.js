const express = require('express');
const cors = require('cors'); // Ainda precisamos importar se outras rotas usarem globalmente ou você reintroduzir o CORS em outro lugar
const router = express.Router();
const jwt = require('jsonwebtoken');
const Signal = require('../models/Signal'); // Certifique-se de que seu modelo Signal está corretamente definido
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// Middleware de autenticação
const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'Sem token, autorização negada' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (e) {
    console.error('Erro de autenticação do token:', e.message); // Log mais detalhado
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Criar novo sinal
router.post('/', auth, async (req, res) => {
  const { pair, analysis, direction, duration } = req.body;

  // --- Adicionado para depuração ---
  console.log('Requisição POST para /api/signals recebida:');
  console.log('pair:', pair);
  console.log('analysis:', analysis);
  console.log('direction:', direction);
  console.log('duration:', duration);
  // --- Fim da depuração ---
  
  try {
    const newSignal = new Signal({
      userId: req.user._id,
      pair,
      analysis,
      direction,
      duration
    });

    await newSignal.save();
    res.status(201).json(newSignal); // Retorna 201 Created para sucesso na criação
  } catch (err) {
    console.error('Erro ao salvar sinal no MongoDB:', err); // Log mais detalhado do erro
    // Em caso de erro de validação (por exemplo, campos 'required' ausentes), o status costuma ser 400
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    res.status(500).json({ message: 'Erro interno do servidor ao salvar sinal', error: err.message });
  }
});

// Obter histórico de sinais
router.get('/', auth, async (req, res) => {
  try {
    const signals = await Signal.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json(signals);
  } catch (err) {
    console.error('Erro ao obter sinais:', err); // Adicionado log
    res.status(500).json({ message: 'Erro ao obter sinais' });
  }
});

// Limpar histórico
router.delete('/', auth, async (req, res) => {
  try {
    await Signal.deleteMany({ userId: req.user._id });
    res.json({ message: 'Histórico limpo' });
  } catch (err) {
    console.error('Erro ao limpar histórico:', err); // Adicionado log
    res.status(500).json({ message: 'Erro ao limpar histórico' });
  }
});

// Rota para deletar um sinal específico
router.delete('/:id', auth, async (req, res) => {
  try {
    const signal = await Signal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!signal) {
      return res.status(404).json({ message: 'Sinal não encontrado ou não autorizado' });
    }

    res.json({ message: 'Sinal removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover sinal específico:', err); // Log mais detalhado
    res.status(500).json({ message: 'Erro ao remover sinal' });
  }
});

module.exports = router;

console.log('📦 Carregando signals.js rotas');