// Importa a função 'verify' para verificar o token JWT
const { verify } = require("jsonwebtoken");
// Importa a classe de erro personalizada
const AppError = require("../utils/appError");
// Importa a configuração de autenticação
const authConfig = require("../configs/auth");

function ensureAuthentication(request, response, next) {
  // Obtém o cabeçalho de autenticação da requisição
  const authHeader = request.headers;

  // Verifica se o cabeçalho contém um cookie
  if (!authHeader.cookie) {
    // Lança um erro se o token não estiver presente
    throw new AppError("JWT - Token não informado");
  }
  
  // Extrai o token do cookie
  const [, token] = authHeader.cookie.split("token=");

  try {
    // Verifica e decodifica o token usando a chave secreta
    const { role, sub: id } = verify(token, authConfig.jwt.secret);

    // Adiciona as informações do usuário à requisição
    request.user = {
      user_id: id,
      role,
    };

    return next();  // Se o token for válido, continua para o próximo middleware ou rota
  } catch (error) {
    // Lança um erro se o token for inválido
    throw new AppError("JWT - Token inválido");
  }
}

module.exports = ensureAuthentication;
