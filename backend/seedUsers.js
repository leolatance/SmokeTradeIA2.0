require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedDatabase() {
  // Conectar ao MongoDB
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log('Conectado ao MongoDB...');

  // Lista de usuários (mantendo os hashes originais)
  const users = [
    {
      email: "admin@smoketrade.com",
      password: "$2b$10$/m9QjsD5MuHl.rs7VTIHC.TLHvYnKVJyJOYOSTAoItsEXZEIIbYdu",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "leolatance@gmail.com",
      password: "$2b$10$Dt70USwHjAMfYcJBkF3muuQ/29Uf0J6iLI5S94ZYcV5qVak/7Uu8G",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "lamine@gmail.com",
      password: "$2b$10$Id2hwwQuumq5LoraRoJ.8ulqM4Qs8gbXH.42IXVRnFe.nbl.FOTWu",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "purplehaze@smoketrade.com",
      password: "$2b$10$LzP9a/rBcCLe0azlqg3lwuFTXgpHarQKTayTrgS.z7cW6rMTzNihq",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "ogkush@smoketrade.com",
      password: "$2b$10$YlVbTNZNZOqovmsWiEyWaOJctIvYlAB4DJhd9f4YEqpzp0S0sxR0i",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "blueberry@smoketrade.com",
      password: "$2b$10$ECBVXlbH/SigbtxZqtSf/.YU34tTgntQAtAiBXlIjkpjeHyJC7Xli",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "greendream@smoketrade.com",
      password: "$2b$10$yBL.45./pf.WT3HeMu3i7OcVohx.7LMk0R6v69WfTOiGRD8EBkvmm",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "whitewidow@smoketrade.com",
      password: "$2b$10$LTlS6nzuzj1rAQhb0gB2LerdYyCOzcSdxfHsdis01Y8mzbNI9xSI2",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "gelatoxl@smoketrade.com",
      password: "$2b$10$UjTiNYC5Oq7aEPT99HFiO.8ltYWkYbpiwQb9e3ecgEzbRlpJHDVXq",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "amnesiahaze@smoketrade.com",
      password: "$2b$10$eBg4qD9Aq5QoQJmMHwFCEeLCJhKIh3o6zH9w1ATg98ql.EULrY2ku",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "sourdiesel@smoketrade.com",
      password: "$2b$10$J8xOP5/fBNOJYuMDbCSjluOdEoqqRzwxLNfUhpsCAOmh1nA5E5Jim",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "gorillaglue@smoketrade.com",
      password: "$2b$10$E6iyot7.LLncXDFF4wQoT.Ejp.J9M2cOl99xFlRzW18pZZcnH8TUq",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "lemonhaze@smoketrade.com",
      password: "$2b$10$hNEcRqOT015FuXVoBbKBzuPSRfhdQWHqJ.8FK7593lDWL5U9iW9Ri",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "zkittlez@smoketrade.com",
      password: "$2b$10$eisI9AhXEo9bP0jYHCQrsODYft36aOXkr8e/v0vQwNmRWCTTLnk1O",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "weddingcake@smoketrade.com",
      password: "$2b$10$aQB7o2oKYfKrdJIu3LtkOedpohomqQQwgVvJKejnj1diiF8m1s9du",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "runtz@smoketrade.com",
      password: "$2b$10$DZxpi4TCjHFE0m2DKOAPfeVrxEhnJuILHXn5R7TPKl9ke0dK02M2a",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "chemdawg@smoketrade.com",
      password: "$2b$10$ovcPO61bw2KSvhubQt1t2ut91p7kp2/Hh.a5E2HUcFgetWw3IEXIu",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    },
    {
      email: "icecreamcake@smoketrade.com",
      password: "$2b$10$atVcjEKScB42BP4b5CqFm.Dk2o/Feldi2dyukESI.8lJQNBNJqXyW",
      accessToken: "sk_prod_xyz123",
      plano: "premium",
      validade: new Date("2024-12-31")
    }
  ];

  // Inserir usuários no banco
  for (const userData of users) {
    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: userData.email });
    
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`Usuário ${userData.email} criado com sucesso!`);
    } else {
      console.log(`Usuário ${userData.email} já existe. Pulando...`);
    }
  }

  console.log('Seed concluído!');
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});