// Importa a função de formatação de datas do date-fns
const { format } = require("date-fns");
// Importa a localidade pt-BR para formatação em português do Brasil
const { ptBR } = require("date-fns/locale");

// Função para formatar uma data no padrão dd/MM/yyyy - HH:mm:ss
function formatDate(date) {
  return format(date, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });
}

// Exporta a função formatDate para uso em outros módulos
module.exports = formatDate;
