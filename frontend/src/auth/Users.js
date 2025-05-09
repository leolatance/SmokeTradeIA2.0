import bcrypt from 'bcryptjs';

// Lista de usuários (senhas criptografadas)
export const users = [
  {
    email: "admin@smoketrade.com",
    passwordHash: "$2b$10$/m9QjsD5MuHl.rs7VTIHC.TLHvYnKVJyJOYOSTAoItsEXZEIIbYdu",
    accessToken: "sk_prod_xyz123",
    plano: "premium",
    validade: "2024-12-31"
  },
  {
    email: "leolatance@gmail.com",
    passwordHash: "$2b$10$Dt70USwHjAMfYcJBkF3muuQ/29Uf0J6iLI5S94ZYcV5qVak/7Uu8G",
    accessToken: "sk_prod_xyz123",
    plano: "premium",
    validade: "2024-12-31"
  },
  {
  email: "lamine@gmail.com",
  passwordHash: "$2b$10$Id2hwwQuumq5LoraRoJ.8ulqM4Qs8gbXH.42IXVRnFe.nbl.FOTWu",
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