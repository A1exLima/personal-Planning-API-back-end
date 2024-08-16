// Importa o módulo mongoose para manipulação do MongoDB
const mongoose = require("mongoose");
// Importa a função para formatar datas
const formatDate = require("../utils/formatDate");

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true  // Nome do usuário é obrigatório
    },
    email: { 
      type: String, 
      required: true, 
      unique: true  // Email deve ser único
    },
    password: { 
      type: String, 
      required: true  // Senha é obrigatória
    },
    avatar: { 
      type: String, 
      default: null  // Avatar é opcional
    },
    created_at: { 
      type: String, 
      required: true, 
      default: () => formatDate(new Date())  // Data de criação, formatada pela função formatDate
    },
    updated_at: { 
      type: String, 
      default: null  // Data de atualização é opcional
    },
    role: {
      type: String,
      enum: ["admin", "customer"],  // Define os papéis possíveis para o usuário
      required: true  // Papel é obrigatório
    }
  },
  {
    collection: "users"  // Nome da coleção no MongoDB
  }
);

// Criando o modelo baseado no esquema
const User = mongoose.model("User", userSchema);

// Exporta o modelo User para uso em outros módulos
module.exports = User;