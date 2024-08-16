// Importa módulos necessários
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

// Define o diretório temporário e de uploads
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOADS_FOLDER = path.resolve(__dirname, TMP_FOLDER, "uploads");

// Configuração do Multer para armazenamento de arquivos
const MULTER = {
  storage: multer.diskStorage({
    // Define o diretório onde os arquivos serão armazenados
    destination: TMP_FOLDER,
    // Define o nome do arquivo
    filename(request, file, callback) {
      // Gera um hash aleatório para evitar conflitos de nomes
      const fileHash = crypto.randomBytes(10).toString("hex");
      // Cria o nome do arquivo com o hash e o nome original do arquivo
      const fileName = `${fileHash}-${file.originalname}`;

      // Chama o callback com o nome do arquivo
      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
};
