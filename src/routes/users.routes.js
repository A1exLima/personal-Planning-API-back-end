// Importa o roteador do Express
const { Router } = require("express");
const usersRoutes = Router();

// Importa o multer para upload de arquivos e configurações de upload
const multer = require("multer");
const uploadConfig = require("../configs/uploads");
const upload = multer(uploadConfig.MULTER);

// Importa middlewares para autenticação, autorização e validação
const ensureAuthentication = require("../middlewares/ensureAuthentication");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");
const verifyFieldsIfEmpty = require("../middlewares/verifyFieldIfEmpty");
const confirmPassword = require("../middlewares/confirmPassword");

// Importa os controladores de usuários
const userControllers = require("../controllers/userControllers");

// Rota para registro de usuário
usersRoutes.post('/', 
  verifyFieldsIfEmpty,  // Valida se os campos obrigatórios estão preenchidos
  confirmPassword,      // Confirma se as senhas coincidem
  userControllers.register
);

// Rota para exibição de informações de usuário autenticado
usersRoutes.get("/", 
  ensureAuthentication,  // Garante que o usuário esteja autenticado
  userControllers.show
);

// Rota para listagem de usuários por página, acessível apenas por administradores
usersRoutes.get("/:page", 
  ensureAuthentication,                       // Garante que o usuário esteja autenticado
  verifyUserAuthorization(["admin"]),         // Verifica se o usuário é um administrador
  userControllers.index
);

// Rota para atualização de informações de usuário
usersRoutes.put("/", 
  verifyFieldsIfEmpty,                        // Valida se os campos obrigatórios estão preenchidos
  ensureAuthentication,                       // Garante que o usuário esteja autenticado
  verifyUserAuthorization(["customer", "admin"]),  // Verifica se o usuário tem autorização
  userControllers.update
);

// Rota para atualização de avatar de usuário
usersRoutes.patch("/avatar", 
  ensureAuthentication,           // Garante que o usuário esteja autenticado
  upload.single("avatar"),         // Faz o upload de um único arquivo de avatar
  userControllers.avatar
);

// Rota para exclusão de usuário
usersRoutes.delete("/", 
  ensureAuthentication,                       // Garante que o usuário esteja autenticado
  verifyUserAuthorization(["customer", "admin"]),  // Verifica se o usuário tem autorização
  userControllers.delete
);

// Exporta as rotas de usuários para uso em outros módulos
module.exports = usersRoutes;
