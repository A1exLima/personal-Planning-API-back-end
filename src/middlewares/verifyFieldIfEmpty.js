// Importa a classe de erro personalizada
const AppError = require("../utils/appError");

// Middleware para verificar se há campos vazios na requisição
function verifyFieldsIfEmpty(request, response, next) {
  const object = request.body;  // Obtém o corpo da requisição

  // Itera sobre as chaves do objeto
  for (let key in object) {
    // Verifica se a chave é uma propriedade própria do objeto
    if (object.hasOwnProperty(key)) {
      // Verifica se o campo está vazio
      if (!object[key]) {
        // Se o campo estiver vazio, lança um erro com uma mensagem específica
        throw new AppError(`O campo '${key}' não pode estar vazio. Preencha todos os campos.`, 401);
      }
    }
  }
  
  return next();  // Se todos os campos estiverem preenchidos, continua para o próximo middleware ou rota
}

module.exports = verifyFieldsIfEmpty;
