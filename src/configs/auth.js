// Exporta as configurações de autenticação JWT
module.exports = {
  jwt: {
    // Segredo para assinar o token JWT, obtido das variáveis de ambiente
    secret: process.env.AUTH_SECRET,
    // Tempo de expiração do token JWT
    expiresIn: "7d",
  },
};
