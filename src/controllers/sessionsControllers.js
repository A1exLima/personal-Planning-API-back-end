// Importa módulos necessários
const AppError = require("../utils/appError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authConfig = require("../configs/auth");
const { sign } = require("jsonwebtoken");

class SessionsControllers {
  // POST - Cria uma sessão para login do usuário
  async create(request, response) {
    const { email, password } = request.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email: email }).lean();
    if (!user) {
      throw new AppError("E-mail e/ou senha incorreta", 404);
    }

    // Verifica se a senha corresponde
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new AppError("E-mail e/ou senha incorreta", 401);
    }

    // Autenticação do usuário - JWT
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({ role: user.role }, secret, {
      subject: String(user._id),
      expiresIn,
    });

    // Envia o token para o cookie
    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 86400000, // 7 dias em milissegundos
    });

    // Remove a senha dos dados do usuário antes de enviar a resposta
    delete user.password;

    response.status(200).json({
      user,
    });
  }
}

module.exports = new SessionsControllers();
