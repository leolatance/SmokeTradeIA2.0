import bcrypt from 'bcryptjs';

// Lista de usuários (senhas criptografadas)
export const users = [
  {
    email: "admin@smoketrade.com",
    passwordHash: "$2b$10$/m9QjsD5MuHl.rs7VTIHC.TLHvYnKVJyJOYOSTAoItsEXZEIIbYdu",
    accessToken: "sk_prod_xyz123",
    plano: "premium",
    validade: "2024-12-31"
  }
];

// Função de verificação
export const verifyUser = async (email, password) => {
  const user = users.find(u => u.email === email)
  if (!user) return null
  
  const match = await bcrypt.compare(password, user.passwordHash)
  return match ? user : null
}