// Importa a classe de erro personalizada
const AppError = require("../utils/appError");

function confirmPassword(request, response, next) {
  const { password, confirmPassword } = request.body;  // Obtém as senhas do corpo da requisição

  // Verifica se a senha e a confirmação da senha são iguais
  if (password !== confirmPassword) {
    // Se as senhas não corresponderem, lança um erro com uma mensagem específica
    throw new AppError("Senha de confirmação incorreta", 401);
  }

  next();  // Se as senhas corresponderem, continua para o próximo middleware ou rota
}

module.exports = confirmPassword;
