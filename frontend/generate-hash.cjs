const bcrypt = require('bcryptjs');
const prompt = require('prompt-sync')(); // Módulo para input

// Solicita a senha
const senha = prompt('Digite a senha para o cliente: ');
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(senha, salt);

console.log('\nHash gerado:');
console.log(hash);
console.log('\nGuarde este hash!');