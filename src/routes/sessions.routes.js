// Importa o roteador do Express
const { Router } = require('express');
const sessionsRoutes = Router();

// Importa o middleware para verificar se os campos estão vazios
const verifyFieldIfEmpty = require("../middlewares/verifyFieldIfEmpty");

// Importa os controladores de sessões
const userControllers = require('../controllers/sessionsControllers');

// Rota para criação de sessão de usuário
sessionsRoutes.post("/", 
  verifyFieldIfEmpty,  // Valida se os campos obrigatórios estão preenchidos
  userControllers.create
);

// Exporta as rotas de sessões para uso em outros módulos
module.exports = sessionsRoutes;
