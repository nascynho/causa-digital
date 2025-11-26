const mongoose = require("mongoose");

const DoacaoSchema = new mongoose.Schema({
  doador: { type: mongoose.Schema.Types.ObjectId, ref: 'Pessoa' }, // Referência ao usuário logado
  nomeDoador: String, // Fallback para doação anônima/sem login
  email: String,
  valor: { type: Number, required: true },
  campanha: { type: mongoose.Schema.Types.ObjectId, ref: 'Campanha' },
  mensagem: String,
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Doacao", DoacaoSchema);
