const express = require("express");
const router = express.Router();
const Campanha = require("../models/Campanha");

router.get("/", async (req, res) => {
  const campanhas = await Campanha.find().populate("ongId");
  res.json(campanhas);
});

router.post("/", async (req, res) => {
  const novaCampanha = new Campanha(req.body);
  await novaCampanha.save();
  res.json(novaCampanha);
});

module.exports = router;
