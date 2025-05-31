const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Signal = require('../models/Signal');
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
    res.status(400).json({ message: 'Token inválido' });
  }
};

// Criar novo sinal
router.post('/', auth, async (req, res) => {
  const { pair, analysis, direction, duration } = req.body;
  
  try {
    const newSignal = new Signal({
      userId: req.user._id,
      pair,
      analysis,
      direction,
      duration
    });

    await newSignal.save();
    res.json(newSignal);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar sinal' });
  }
});

// Obter histórico de sinais
router.get('/', auth, async (req, res) => {
  try {
    const signals = await Signal.find({ userId: req.user._id }).sort({ timestamp: -1 });
    res.json(signals);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter sinais' });
  }
});

// Limpar histórico
router.delete('/', auth, async (req, res) => {
  try {
    await Signal.deleteMany({ userId: req.user._id });
    res.json({ message: 'Histórico limpo' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao limpar histórico' });
  }
});

module.exports = router;