const mongoose = require("mongoose");

const CampanhaSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  meta: Number,
  arrecadado: { type: Number, default: 0 },
  categoria: String,
  imagem: String,
  ongId: { type: mongoose.Schema.Types.ObjectId, ref: "Ong" },
});

module.exports = mongoose.model("Campanha", CampanhaSchema);

