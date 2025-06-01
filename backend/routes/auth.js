const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Adicionado
const User = require('../models/User');
const { JWT_SECRET } = process.env;

// Configuração de CORS
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://smoke-trade-ia-2-0.vercel.app'
  ],
  methods: ['POST', 'GET'], // Métodos permitidos
  allowedHeaders: ['Content-Type'], // Headers permitidos
  credentials: true
};

// Aplicar CORS a todas as rotas deste router
router.use(cors(corsOptions));

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        plano: user.plano,
        validade: user.validade
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;

console.log('📦 Carregando auth.js rotas');
