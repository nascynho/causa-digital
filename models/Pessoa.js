
const mongoose = require("mongoose");

const PessoaSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
  senha: String,
  tipo: String
}, { timestamps: true });

module.exports = mongoose.model("Pessoa", PessoaSchema);
