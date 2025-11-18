const express = require("express");
const router = express.Router();
const Ong = require("../models/Ong");

router.get("/", async (req, res) => {
  const ongs = await Ong.find();
  res.json(ongs);
});

router.post("/", async (req, res) => {
  const novaOng = new Ong(req.body);
  await novaOng.save();
  res.json(novaOng);
});

module.exports = router;
