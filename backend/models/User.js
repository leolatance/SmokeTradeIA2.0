const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String, required: true },
  plano: { type: String, required: true },
  validade: { type: Date, required: true },
});

module.exports = mongoose.model('User', userSchema);