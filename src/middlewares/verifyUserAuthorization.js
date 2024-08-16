// Importa a classe de erro personalizada
const AppError = require("../utils/appError");

// Middleware para verificar a autorização do usuário com base no papel
function verifyUserAuthorization(roleToVerify) {
  return (request, response, next) => {
    const { role } = request.user;  // Obtém o papel do usuário a partir da requisição

    // Verifica se o papel do usuário está na lista de papéis permitidos
    if (!roleToVerify.includes(role)) {
      // Se o papel não estiver autorizado, lança um erro de autorização
      throw new AppError("Não autorizado", 401);
    }

    return next();  // Se autorizado, continua para o próximo middleware ou rota
  }
}

module.exports = verifyUserAuthorization;