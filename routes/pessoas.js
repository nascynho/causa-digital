
const express = require("express");
const router = express.Router();
const Pessoa = require("../models/Pessoa");

router.post("/", async (req, res) => {
  try {
    const novaPessoa = new Pessoa(req.body);
    await novaPessoa.save();
    res.status(201).json(novaPessoa);
  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar pessoa" });
  }
});

module.exports = router;
