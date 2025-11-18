const mongoose = require("mongoose");

const OngSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  cidade: String,
  imagem: String
});

module.exports = mongoose.model("Ong", OngSchema);
