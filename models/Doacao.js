const mongoose = require("mongoose");

const DoacaoSchema = new mongoose.Schema({
  nomeDoador: String,
  email: String,
  valor: Number,
  campanha: String,
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Doacao", DoacaoSchema);
