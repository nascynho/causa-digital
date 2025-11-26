
const mongoose = require("mongoose");

const PessoaSchema = new mongoose.Schema({
  nome: String,
  email: String,
  telefone: String,
  senha: String,
  tipo: String,
  pontos: { type: Number, default: 0 },
  totalDoado: { type: Number, default: 0 },
  badges: [String],
  nivel: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Pessoa", PessoaSchema);
