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
},
{
email: "purplehaze@smoketrade.com",
passwordHash: "$2b$10$LzP9a/rBcCLe0azlqg3lwuFTXgpHarQKTayTrgS.z7cW6rMTzNihq",
accessToken: "sk_prod_xyz123",
plano: "premium",
validade: "2024-12-31"
},
{
  email: "ogkush@smoketrade.com",
  passwordHash: "$2b$10$YlVbTNZNZOqovmsWiEyWaOJctIvYlAB4DJhd9f4YEqpzp0S0sxR0i",
  accessToken: "sk_prod_xyz123",
  plano: "premium",
  validade: "2024-12-31"
  },
  {
    email: "blueberry@smoketrade.com",
    passwordHash: "$2b$10$ECBVXlbH/SigbtxZqtSf/.YU34tTgntQAtAiBXlIjkpjeHyJC7Xli",
    accessToken: "sk_prod_xyz123",
    plano: "premium",
    validade: "2024-12-31"
    },
    {
        email: "greendream@smoketrade.com",
        passwordHash: "$2b$10$yBL.45./pf.WT3HeMu3i7OcVohx.7LMk0R6v69WfTOiGRD8EBkvmm",
        accessToken: "sk_prod_xyz123",
        plano: "premium",
        validade: "2024-12-31"
        },
        {
          email: "whitewidow@smoketrade.com",
          passwordHash: "$2b$10$LTlS6nzuzj1rAQhb0gB2LerdYyCOzcSdxfHsdis01Y8mzbNI9xSI2",
          accessToken: "sk_prod_xyz123",
          plano: "premium",
          validade: "2024-12-31"
          },
          {
            email: "gelatoxl@smoketrade.com",
            passwordHash: "$2b$10$UjTiNYC5Oq7aEPT99HFiO.8ltYWkYbpiwQb9e3ecgEzbRlpJHDVXq",
            accessToken: "sk_prod_xyz123",
            plano: "premium",
            validade: "2024-12-31"
            },
            {
              email: "amnesiahaze@smoketrade.com",
              passwordHash: "$2b$10$eBg4qD9Aq5QoQJmMHwFCEeLCJhKIh3o6zH9w1ATg98ql.EULrY2ku",
              accessToken: "sk_prod_xyz123",
              plano: "premium",
              validade: "2024-12-31"
              },
              {
                email: "sourdiesel@smoketrade.com",
                passwordHash: "$2b$10$J8xOP5/fBNOJYuMDbCSjluOdEoqqRzwxLNfUhpsCAOmh1nA5E5Jim",
                accessToken: "sk_prod_xyz123",
                plano: "premium",
                validade: "2024-12-31"
                },
                {
                  email: "gorillaglue@smoketrade.com",
                  passwordHash: "$2b$10$E6iyot7.LLncXDFF4wQoT.Ejp.J9M2cOl99xFlRzW18pZZcnH8TUq",
                  accessToken: "sk_prod_xyz123",
                  plano: "premium",
                  validade: "2024-12-31"
                  },
                  {
                    email: "lemonhaze@smoketrade.com",
                    passwordHash: "$2b$10$hNEcRqOT015FuXVoBbKBzuPSRfhdQWHqJ.8FK7593lDWL5U9iW9Ri",
                    accessToken: "sk_prod_xyz123",
                    plano: "premium",
                    validade: "2024-12-31"
                    },
                  
];

// Função de verificação
export const verifyUser = async (email, password) => {
  const user = users.find(u => u.email === email)
  if (!user) return null
  
  const match = await bcrypt.compare(password, user.passwordHash)
  return match ? user : null
}