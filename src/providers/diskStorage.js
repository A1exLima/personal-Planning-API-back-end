// Importa o módulo 'fs' para manipulação de arquivos
const fs = require("fs");
// Importa as configurações de upload
const uploadConfigs = require("../configs/uploads");
// Importa o módulo 'path' para manipulação de caminhos de arquivos
const path = require("path");

class DiskStorage {
  // Método para salvar um arquivo movendo-o do diretório temporário para o diretório de uploads
  async saveFile(file) {
    await fs.promises.rename(
      // Resolve o caminho do arquivo no diretório temporário
      path.resolve(uploadConfigs.TMP_FOLDER, file),
      // Resolve o caminho do arquivo no diretório de uploads
      path.resolve(uploadConfigs.UPLOADS_FOLDER, file)
    );

    return file; // Retorna o nome do arquivo
  }

  // Método para deletar um arquivo do diretório de uploads
  async deleteFile(file) {
    const filePath = path.resolve(uploadConfigs.UPLOADS_FOLDER, file);

    try {
      // Verifica se o arquivo existe
      await fs.promises.stat(filePath);
    } catch {
      return; // Se o arquivo não existir, não faz nada
    }

    // Remove o arquivo
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;