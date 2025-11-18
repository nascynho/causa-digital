const express = require("express");
const router = express.Router();
const Doacao = require("../models/Doacao");

router.get("/", async (req, res) => {
  const doacoes = await Doacao.find();
  res.json(doacoes);
});

router.post("/", async (req, res) => {
  const novaDoacao = new Doacao(req.body);
  await novaDoacao.save();
  res.json(novaDoacao);
});

module.exports = router;
