// Importa módulos necessários
const User = require("../models/User");
const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const DiskStorage = require("../providers/diskStorage");
const formatDate = require("../utils/formatDate");

class UserControllers {
  // POST - Cria um novo usuário
  async register(request, response) {
    const { name, email, password, confirmPassword, role } = request.body;

    // Verifica se o usuário já existe pelo e-mail
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      throw new AppError("Por favor, utilize outro e-mail", 422);
    }

    // Cria uma senha hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Cria o usuário no MongoDB Atlas
    const user = new User({
      name,
      email,
      password: passwordHash,
      role,
    });

    try {
      await user.save();
      response.status(201).json({
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      throw new AppError(`DataBase ${error}`, 500);
    }
  }

  // GET - Exibe os dados do usuário autenticado
  async show(request, response) {
    const { user_id } = request.user;

    const user = await User.findById(user_id, '-password'); // Exclui a senha dos dados retornados
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    response.status(200).json({
      user,
    });
  }

  // GET - Lê dados de todos os usuários com autorização de administrador
  async index(request, response) {
    const { page } = request.params;
    const limit = 50;
    const skip = (page - 1) * limit; // Corrige o cálculo de skip

    try {
      const users = await User.find({}, '-password').skip(skip).limit(limit);

      response.status(200).json({
        users,
      });
    } catch (error) {
      throw new AppError(error, 404);
    }
  }

  // PUT - Atualiza os dados do usuário
  async update(request, response) {
    const { user_id } = request.user;
    const { name, role, email, oldPassword, newPassword } = request.body;

    // Verifica se o usuário existe
    const user = await User.findById({ _id: user_id }).lean();
    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    // Verifica se o novo e-mail está em uso
    const emailIsInUse = await User.findOne({ email });
    if (emailIsInUse && !emailIsInUse._id.equals(user._id)) {
      throw new AppError("Email encontra-se em uso", 401);
    }

    // Verifica se a senha antiga está correta
    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if (!checkPassword) {
      throw new AppError("Senha antiga incorreta", 401);
    }

    // Atualiza a senha para a nova senha digitada
    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    const userDataFieldForUpdating = {
      name,
      email,
      password: newPasswordHash,
      role,
      updated_at: formatDate(new Date()),
    };

    // Atualiza todos os campos fornecidos
    try {
      await User.findByIdAndUpdate(user._id, userDataFieldForUpdating, { new: true });

      // Recupera o usuário atualizado sem o campo `password`
      const updatedUser = await User.findById(user._id).select('-password');

      response.status(200).json({
        updatedUser,
      });
    } catch (error) {
      throw new AppError(`DataBase ${error}`, 500);
    }
  }

  // PATCH - Atualiza a imagem do usuário
  async avatar(request, response) {
    const { user_id } = request.user;
    const avatarName = request.file ? request.file.filename : null;
    const diskStorage = new DiskStorage();

    if (!avatarName) {
      throw new AppError("Imagem do usuário não anexada", 400);
    }

    const user = await User.findById({ _id: user_id });
    if (!user) {
      throw new AppError("Usuário não encontrado", 401);
    }

    // Remove o avatar antigo se existir
    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    // Salva o novo avatar
    const fileName = await diskStorage.saveFile(avatarName);

    const userDataFieldForUpdating = {
      updated_at: formatDate(new Date()),
      avatar: fileName,
    };

    // Atualiza apenas os campos necessários
    try {
      await User.findByIdAndUpdate(user._id, userDataFieldForUpdating, { new: true });

      // Recupera o usuário atualizado sem o campo `password`
      const updatedUser = await User.findById(user._id).select('-password');

      response.status(200).json({
        updatedUser,
      });
    } catch (error) {
      throw new AppError(`DataBase ${error}`, 500);
    }
  }

  // DELETE - Exclui o usuário
  async delete(request, response) {
    const { user_id } = request.user;

    const user = await User.findById({ _id: user_id });
    if (user) {
      try {
        const deletedUser = await User.findByIdAndDelete(user._id);

        return response.status(200).json({
          message: "Usuário deletado com sucesso",
          deletedUser,
        });
      } catch (error) {
        throw new AppError(`DataBase ${error}`, 500);
      }
    }
  }
}

module.exports = new UserControllers();
