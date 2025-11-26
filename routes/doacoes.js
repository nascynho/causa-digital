const express = require("express");
const router = express.Router();
const Doacao = require("../models/Doacao");
const Campanha = require("../models/Campanha");
const Pessoa = require("../models/Pessoa");

router.get("/", async (req, res) => {
  try {
    const doacoes = await Doacao.find().populate('campanha').populate('doador');
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/doador/:id", async (req, res) => {
  try {
    const doacoes = await Doacao.find({ doador: req.params.id }).populate('campanha');
    res.json(doacoes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { doador, campanha, valor, mensagem, nomeDoador, email } = req.body;
    
    const novaDoacao = new Doacao({
      doador,
      campanha,
      valor,
      mensagem,
      nomeDoador,
      email
    });
    
    await novaDoacao.save();

    // Atualizar valor arrecadado na campanha
    if (campanha) {
      const camp = await Campanha.findById(campanha);
      if (camp) {
        camp.arrecadado += valor;
        await camp.save();
      }
    }

    // Atualizar pontos do doador (1 ponto por real)
    if (doador) {
      const user = await Pessoa.findById(doador);
      if (user) {
        user.pontos = (user.pontos || 0) + Math.floor(valor);
        user.totalDoado = (user.totalDoado || 0) + valor;
        
        // Lógica simples de badges
        if (!user.badges) user.badges = [];
        if (!user.badges.includes('primeiro_passo')) user.badges.push('primeiro_passo');
        if (user.pontos > 100 && !user.badges.includes('heroi_solidario')) user.badges.push('heroi_solidario');
        
        await user.save();
      }
    }

    res.status(201).json(novaDoacao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
