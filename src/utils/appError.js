// Define a classe AppError para representar erros personalizados
class AppError {
  // Propriedades statusCode e message
  statusCode;
  message;

  // Construtor da classe que inicializa a mensagem de erro e o código de status (padrão 400)
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

// Exporta a classe AppError para uso em outros módulos
module.exports = AppError;
