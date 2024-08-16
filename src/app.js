// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Captura erros assíncronos de forma automática
require("express-async-errors");

// Importa a classe de erro personalizada
const AppError = require("./utils/appError");

// Importa as bibliotecas necessárias
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const uploadConfigs = require("./configs/uploads");

// Inicializa o aplicativo Express
const app = express();

// Middleware para gerenciar cookies
app.use(cookieParser());

// Middleware para interpretar JSON nas requisições
app.use(express.json());

// Middleware para configurar CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true,
  })
);

// Importa o modelo de usuário
const User = require("./models/User");

// Middleware para servir arquivos estáticos da pasta de uploads
app.use("/files", express.static(uploadConfigs.UPLOADS_FOLDER));

// Importa as rotas definidas no arquivo index.js
const routes = require('./routes/index');
app.use(routes);

// Middleware para capturar erros
app.use((error, request, response, next) => {
  // Se o erro for uma instância de AppError, retorna um JSON com o status e mensagem específicos
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.statusCode,
      message: error.message,
    });
  }
  
  // Loga o erro no console para debug em ambiente de desenvolvimento
  console.error(error);
  
  // Retorna um erro genérico de servidor caso ocorra algum erro não tratado
  return response.status(500).json({
    error: "Error: 500",
    message: "Internal Server Error",
  });
});

// Obtém as variáveis de ambiente para conectar ao MongoDB
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Desativa o modo estrito de consulta do Mongoose (opcional)
mongoose.set('strictQuery', false);

// Conecta ao MongoDB Atlas utilizando as variáveis de ambiente
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@clusterpersonalplanning.zhgvb.mongodb.net/dataBasePersonalPlanning`)
  .then(() => {
    // Obtém a porta do ambiente ou usa a porta 3000 por padrão
    const port = process.env.PORT || 3000;
    
    // Inicia o servidor Express na porta especificada
    app.listen(port, () => console.log(`Server is running on port: ${port}`));
    
    // Mensagem de log indicando que a conexão foi estabelecida com sucesso
    console.log("Connection to MongoDb Atlas database executed successfully");
  })
  .catch((error) => console.log(error));
