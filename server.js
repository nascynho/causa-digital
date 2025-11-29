import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/causadigital";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

const doadorSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  tipo: { type: String, default: "doador" },
  pontos: { type: Number, default: 0 },
  nivel: { type: Number, default: 1 },
  totalArrecadado: { type: Number, default: 0 },
  doacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doacao" }],
  badges: [String],
  metasPessoais: [{ 
    nome: String, 
    valor: Number, 
    arrecadado: { type: Number, default: 0 },
    categoria: String 
  }],
  criadoEm: { type: Date, default: Date.now }
}, { timestamps: true });

const ongSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  descricao: String,
  logo: String,
  website: String,
  campanhas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campanha" }],
  totalArrecadado: { type: Number, default: 0 },
  metasAlcancadas: { type: Number, default: 0 },
  seguidores: { type: Number, default: 0 },
  criadoEm: { type: Date, default: Date.now }
}, { timestamps: true });

const campanhaSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  categoria: { type: String, enum: ["alimentacao", "saude", "educacao", "abrigo", "outro"] },
  meta: Number,
  imagem: String,
  ong: { type: mongoose.Schema.Types.ObjectId, ref: "ONG" },
  arrecadado: { type: Number, default: 0 },
  doacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doacao" }],
  percentualConcluido: { type: Number, default: 0 },
  impactoDescricao: String,
  criadoEm: { type: Date, default: Date.now },
  encerramento: Date
});

const doacaoSchema = new mongoose.Schema({
  doador: { type: mongoose.Schema.Types.ObjectId, ref: "Doador" },
  campanha: { type: mongoose.Schema.Types.ObjectId, ref: "Campanha" },
  ong: { type: mongoose.Schema.Types.ObjectId, ref: "ONG" },
  valor: Number,
  pontosConcedidos: Number,
  mensagem: String,
  criadoEm: { type: Date, default: Date.now }
}, { timestamps: true });

const Doador = mongoose.model("Doador", doadorSchema);
const ONG = mongoose.model("ONG", ongSchema);
const Campanha = mongoose.model("Campanha", campanhaSchema);
const Doacao = mongoose.model("Doacao", doacaoSchema);

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function senhaEhForte(senha = "") {
  return PASSWORD_REGEX.test(String(senha));
}

app.get("/api/health", async (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = ["desconectado", "conectando", "conectado", "desconectando"];
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongo: statusMap[mongoStatus] || "desconhecido"
  });
});

app.get("/api/campanhas", async (req, res) => {
  try {
    const campanhas = await Campanha.find().populate("ong").populate("doacoes");
    res.json(campanhas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar campanhas" });
  }
});

app.get("/api/campanhas/destaques", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 3;
    const campanhas = await Campanha.find()
      .sort({ percentualConcluido: -1, arrecadado: -1 })
      .limit(limit);
    res.json(campanhas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar destaques" });
  }
});

app.get("/api/campanhas/:id", async (req, res) => {
  try {
    const campanha = await Campanha.findById(req.params.id).populate("ong").populate("doacoes");
    res.json(campanha);
  } catch (error) {
    res.status(404).json({ error: "Campanha não encontrada" });
  }
});

app.post("/api/campanhas", async (req, res) => {
  try {
    const nova = new Campanha(req.body);
    await nova.save();
    res.status(201).json(nova);
  } catch (error) {
    res.status(400).json({ error: "Erro ao salvar campanha" });
  }
});

app.put("/api/campanhas/:id", async (req, res) => {
  try {
    const campanha = await Campanha.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(campanha);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar campanha" });
  }
});

app.post("/api/doacoes", async (req, res) => {
  try {
    const { doadorId, doador, campanhaId, campanha, valor, mensagem } = req.body;
    
    const doadorFinal = doadorId || doador;
    const campanhaFinal = campanhaId || campanha;
    
    const pontos = valor * 10;

    const doacao = new Doacao({
      doador: doadorFinal,
      campanha: campanhaFinal,
      valor,
      pontosConcedidos: pontos,
      mensagem
    });

    await doacao.save();

    if (campanhaFinal) {
      const campanhaDoc = await Campanha.findById(campanhaFinal);
      if (campanhaDoc) {
        campanhaDoc.arrecadado += valor;
        campanhaDoc.percentualConcluido = (campanhaDoc.arrecadado / campanhaDoc.meta) * 100;
        await campanhaDoc.save();
      }
    }

    if (doadorFinal) {
      const doadorDoc = await Doador.findById(doadorFinal);
      if (doadorDoc) {
        doadorDoc.pontos += pontos;
        doadorDoc.totalArrecadado += valor;
        doadorDoc.doacoes.push(doacao._id);
        await verificarAchievements(doadorDoc);
        await doadorDoc.save();
      }
    }

    res.status(201).json(doacao);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Erro ao registrar doação" });
  }
});

app.get("/api/doacoes/doador/:id", async (req, res) => {
  try {
    const doacoes = await Doacao.find({ doador: req.params.id }).populate("campanha");
    res.json(doacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar doacoes" });
  }
});

app.get("/api/doadores/ranking", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const ranking = await Doador.find()
      .sort({ pontos: -1 })
      .limit(limit)
      .select("nome pontos nivel totalArrecadado badges");
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

app.get("/api/ranking", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const ranking = await Doador.find()
      .sort({ pontos: -1 })
      .limit(limit)
      .select("nome pontos nivel totalArrecadado badges");
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

app.get("/api/doadores/:id", async (req, res) => {
  try {
    const doador = await Doador.findById(req.params.id).populate("doacoes");
    res.json(doador);
  } catch (error) {
    res.status(404).json({ error: "Doador não encontrado" });
  }
});

app.post("/api/doadores", async (req, res) => {
  try {
    if (!senhaEhForte(req.body.senha)) {
      return res.status(400).json({
        error: "Senha precisa ter 8+ caracteres, incluindo maiúscula, minúscula, número e símbolo"
      });
    }
    const doador = new Doador(req.body);
    await doador.save();
    res.status(201).json(doador);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar doador" });
  }
});

app.post("/api/auth/login/doador", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const doador = await Doador.findOne({ email });
    if (!doador || doador.senha !== senha) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    res.json({ token: "demo-token", userId: doador._id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar doador" });
  }
});

app.get("/api/ongs", async (req, res) => {
  try {
    const ongs = await ONG.find().populate("campanhas");
    res.json(ongs);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ONGs" });
  }
});

app.post("/api/ongs", async (req, res) => {
  try {
    if (!senhaEhForte(req.body.senha)) {
      return res.status(400).json({
        error: "Senha precisa ter 8+ caracteres, incluindo maiúscula, minúscula, número e símbolo"
      });
    }
    const ong = new ONG(req.body);
    await ong.save();
    res.status(201).json(ong);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar ONG" });
  }
});

app.post("/api/auth/login/ong", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const ong = await ONG.findOne({ email });
    if (!ong || ong.senha !== senha) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    res.json({ token: "demo-token", ongId: ong._id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar ONG" });
  }
});

app.get("/api/ongs/:id", async (req, res) => {
  try {
    const ong = await ONG.findById(req.params.id).populate("campanhas");
    res.json(ong);
  } catch (error) {
    res.status(404).json({ error: "ONG não encontrada" });
  }
});

async function verificarAchievements(doador) {
  if (!Array.isArray(doador.badges)) {
    doador.badges = [];
  }

  const badgesSet = new Set(doador.badges);
  const addBadge = (badge) => badgesSet.add(badge);
  const totalDoacoes = Array.isArray(doador.doacoes) ? doador.doacoes.length : 0;

  const donationMilestones = [
    { key: "impacto_inicial", threshold: 1 },
    { key: "parceiro_constante", threshold: 5 },
    { key: "lider_generoso", threshold: 15 }
  ];

  donationMilestones.forEach(({ key, threshold }) => {
    if (totalDoacoes >= threshold) {
      addBadge(key);
    }
  });

  if (doador.totalArrecadado > 0) {
    addBadge("primeiro_passo");
  }
  if (doador.pontos >= 100) {
    addBadge("heroi_solidario");
  }
  if (doador.pontos >= 1000) {
    addBadge("benfeitor");
  }

  doador.badges = Array.from(badgesSet);
  doador.nivel = Math.floor(doador.pontos / 500) + 1;
}

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
