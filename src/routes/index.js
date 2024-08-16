// Importa o roteador do Express
const { Router } = require('express');
const routes = Router();

// Rota pública que exibe uma mensagem de boas-vindas com arte em ASCII
routes.get("/", (request, response) => {
  const pcDrawing = `
  Bem-vindo à API Personal Planning - Copyright © 2024 - ALEX&lt;CODE/&gt
   ________________________
  |  ____________________  |
  | |                    | |
  | |                    | |
  | |                    | |
  | |         &lt;/&gt        | |
  | |                    | |
  | |                    | |
  | |____________________| |
  |________________________|
  |    [] [] [] [] [] []   |
  |________________________|

       <a target=_blank href="https://alexcode.com.br">alexcode.com.br</a>
  `;

  response.status(200).send(`<pre>${pcDrawing}</pre>`);
});

// Importa e utiliza as rotas de usuários
const usersRoutes = require("../routes/users.routes");
routes.use('/users', usersRoutes);

// Importa e utiliza as rotas de sessões
const sessionsRoutes = require("../routes/sessions.routes");
routes.use("/sessions", sessionsRoutes);

// Exporta as rotas principais para uso em outros módulos
module.exports = routes;
