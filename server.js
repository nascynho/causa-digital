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

const DEMO_MODE = process.env.DEMO_MODE === "true" || process.argv.includes("--demo");

const demoData = {
  doadores: [
    { _id: "demo-doador-1", nome: "Maria Silva", email: "maria@email.com", senha: "Demo@123", pontos: 850, nivel: 2, creditos: 150, totalArrecadado: 85, badges: ["impacto_inicial", "primeiro_passo", "heroi_solidario"], doacoes: ["demo-doacao-1", "demo-doacao-2"], metasPessoais: [] },
    { _id: "demo-doador-2", nome: "João Santos", email: "joao@email.com", senha: "Demo@123", pontos: 1200, nivel: 3, creditos: 500, totalArrecadado: 120, badges: ["impacto_inicial", "primeiro_passo", "heroi_solidario", "benfeitor"], doacoes: ["demo-doacao-3"], metasPessoais: [] },
    { _id: "demo-doador-3", nome: "Ana Costa", email: "ana@email.com", senha: "Demo@123", pontos: 300, nivel: 1, creditos: 50, totalArrecadado: 30, badges: ["impacto_inicial", "primeiro_passo"], doacoes: [], metasPessoais: [] }
  ],
  ongs: [
    { _id: "demo-ong-1", nome: "Alimentação Solidária", email: "contato@alimentacao.org", senha: "Demo@123", descricao: "Combatendo a fome com dignidade", logo: "🍲", campanhas: ["demo-campanha-1"], totalArrecadado: 4500, metasAlcancadas: 2, seguidores: 156 },
    { _id: "demo-ong-2", nome: "Educação Para Todos", email: "contato@educacao.org", senha: "Demo@123", descricao: "Transformando vidas através da educação", logo: "📚", campanhas: ["demo-campanha-2"], totalArrecadado: 8200, metasAlcancadas: 4, seguidores: 312 },
    { _id: "demo-ong-3", nome: "Saúde Comunitária", email: "contato@saude.org", senha: "Demo@123", descricao: "Cuidando de quem mais precisa", logo: "🏥", campanhas: ["demo-campanha-3"], totalArrecadado: 6100, metasAlcancadas: 3, seguidores: 245 }
  ],
  campanhas: [
    { _id: "demo-campanha-1", titulo: "Cesta Básica para 100 Famílias", descricao: "Ajude famílias em situação de vulnerabilidade a terem alimentação garantida por um mês inteiro.", categoria: "alimentacao", meta: 5000, arrecadado: 4500, percentualConcluido: 90, imagem: "🍲", ong: "demo-ong-1", doacoes: [], impactoDescricao: "100 famílias alimentadas por 1 mês" },
    { _id: "demo-campanha-2", titulo: "Material Escolar Completo", descricao: "Kits escolares para crianças de baixa renda iniciarem o ano letivo com dignidade.", categoria: "educacao", meta: 10000, arrecadado: 8200, percentualConcluido: 82, imagem: "📚", ong: "demo-ong-2", doacoes: [], impactoDescricao: "200 crianças com material escolar" },
    { _id: "demo-campanha-3", titulo: "Medicamentos Essenciais", descricao: "Compra de medicamentos para o posto de saúde da comunidade Vila Esperança.", categoria: "saude", meta: 8000, arrecadado: 6100, percentualConcluido: 76, imagem: "🏥", ong: "demo-ong-3", doacoes: [], impactoDescricao: "500 atendimentos garantidos" }
  ],
  doacoes: [
    { _id: "demo-doacao-1", doador: "demo-doador-1", campanha: "demo-campanha-1", valor: 50, pontosConcedidos: 500, mensagem: "Fico feliz em ajudar!", criadoEm: new Date("2025-11-15") },
    { _id: "demo-doacao-2", doador: "demo-doador-1", campanha: "demo-campanha-2", valor: 35, pontosConcedidos: 350, mensagem: "Educação transforma vidas", criadoEm: new Date("2025-11-20") },
    { _id: "demo-doacao-3", doador: "demo-doador-2", campanha: "demo-campanha-3", valor: 120, pontosConcedidos: 1200, mensagem: "Saúde é prioridade", criadoEm: new Date("2025-11-25") }
  ],
  transacoes: [
    { _id: "demo-tx-1", doador: "demo-doador-1", tipo: "compra", valor: 200, creditos: 200, status: "aprovado", metodo: "pix", criadoEm: new Date("2025-11-10") },
    { _id: "demo-tx-2", doador: "demo-doador-2", tipo: "compra", valor: 500, creditos: 500, status: "aprovado", metodo: "cartao", criadoEm: new Date("2025-11-12") },
    { _id: "demo-tx-3", doador: "demo-doador-1", tipo: "doacao", valor: -50, creditos: -50, campanhaId: "demo-campanha-1", status: "concluido", criadoEm: new Date("2025-11-15") }
  ]
};

function generateId() {
  return "demo-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
}

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/causadigital";
let mongoConnected = false;

if (DEMO_MODE) {
  console.log("🎮 Rodando em MODO DEMO (sem MongoDB)");
  console.log("   Dados de exemplo carregados na memória");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => {
      mongoConnected = true;
      console.log("✅ MongoDB conectado com sucesso!");
    })
    .catch((err) => {
      console.error("❌ Erro ao conectar no MongoDB:", err.message);
      console.log("💡 Dica: Execute com --demo para rodar sem MongoDB");
    });
}

const doadorSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  tipo: { type: String, default: "doador" },
  pontos: { type: Number, default: 0 },
  nivel: { type: Number, default: 1 },
  creditos: { type: Number, default: 0 },
  totalArrecadado: { type: Number, default: 0 },
  doacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doacao" }],
  badges: [String],
  metasPessoais: [{ nome: String, valor: Number, arrecadado: { type: Number, default: 0 }, categoria: String }],
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

const transacaoSchema = new mongoose.Schema({
  doador: { type: mongoose.Schema.Types.ObjectId, ref: "Doador" },
  tipo: { type: String, enum: ["compra", "doacao", "bonus"] },
  valor: Number,
  creditos: Number,
  campanhaId: { type: mongoose.Schema.Types.ObjectId, ref: "Campanha" },
  metodo: { type: String, enum: ["pix", "cartao", "boleto"] },
  status: { type: String, enum: ["pendente", "processando", "aprovado", "recusado", "concluido"], default: "pendente" },
  criadoEm: { type: Date, default: Date.now }
}, { timestamps: true });

const Doador = mongoose.model("Doador", doadorSchema);
const ONG = mongoose.model("ONG", ongSchema);
const Campanha = mongoose.model("Campanha", campanhaSchema);
const Doacao = mongoose.model("Doacao", doacaoSchema);
const Transacao = mongoose.model("Transacao", transacaoSchema);

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function senhaEhForte(senha = "") {
  return PASSWORD_REGEX.test(String(senha));
}

async function verificarAchievements(doador) {
  if (!Array.isArray(doador.badges)) doador.badges = [];
  const badgesSet = new Set(doador.badges);
  const totalDoacoes = Array.isArray(doador.doacoes) ? doador.doacoes.length : 0;

  if (totalDoacoes >= 1) badgesSet.add("impacto_inicial");
  if (totalDoacoes >= 5) badgesSet.add("parceiro_constante");
  if (totalDoacoes >= 15) badgesSet.add("lider_generoso");
  if (doador.totalArrecadado > 0) badgesSet.add("primeiro_passo");
  if (doador.pontos >= 100) badgesSet.add("heroi_solidario");
  if (doador.pontos >= 1000) badgesSet.add("benfeitor");

  doador.badges = Array.from(badgesSet);
  doador.nivel = Math.floor(doador.pontos / 500) + 1;
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mode: DEMO_MODE ? "demo" : "production",
    mongo: DEMO_MODE ? "desativado" : (mongoConnected ? "conectado" : "desconectado")
  });
});

// Endpoint de estatísticas da plataforma
app.get("/api/stats", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const totalArrecadado = demoData.campanhas.reduce((acc, c) => acc + c.arrecadado, 0);
      const totalDoacoes = demoData.doacoes.length;
      const totalOngs = demoData.ongs.length;
      const totalCampanhas = demoData.campanhas.length;
      const totalDoadores = demoData.doadores.length;

      return res.json({
        totalArrecadado,
        totalDoacoes,
        totalOngs,
        totalCampanhas,
        totalDoadores,
        ultimaAtualizacao: new Date().toISOString()
      });
    }

    const [totalArrecadado, totalDoacoes, totalOngs, totalCampanhas, totalDoadores] = await Promise.all([
      Campanha.aggregate([{ $group: { _id: null, total: { $sum: "$arrecadado" } } }]),
      Doacao.countDocuments(),
      ONG.countDocuments(),
      Campanha.countDocuments(),
      Doador.countDocuments()
    ]);

    res.json({
      totalArrecadado: totalArrecadado[0]?.total || 0,
      totalDoacoes,
      totalOngs,
      totalCampanhas,
      totalDoadores,
      ultimaAtualizacao: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

app.get("/api/campanhas", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const campanhasPopuladas = demoData.campanhas.map(c => ({
        ...c,
        ong: demoData.ongs.find(o => o._id === c.ong) || null
      }));
      return res.json(campanhasPopuladas);
    }
    const campanhas = await Campanha.find().populate("ong").populate("doacoes");
    res.json(campanhas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar campanhas" });
  }
});

app.get("/api/campanhas/destaques", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 3;
    if (DEMO_MODE) {
      const sorted = [...demoData.campanhas].sort((a, b) => b.percentualConcluido - a.percentualConcluido);
      return res.json(sorted.slice(0, limit));
    }
    const campanhas = await Campanha.find().sort({ percentualConcluido: -1, arrecadado: -1 }).limit(limit);
    res.json(campanhas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar destaques" });
  }
});

app.get("/api/campanhas/:id", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const campanha = demoData.campanhas.find(c => c._id === req.params.id);
      if (!campanha) return res.status(404).json({ error: "Campanha não encontrada" });
      return res.json({ ...campanha, ong: demoData.ongs.find(o => o._id === campanha.ong) || null });
    }
    const campanha = await Campanha.findById(req.params.id).populate("ong").populate("doacoes");
    res.json(campanha);
  } catch (error) {
    res.status(404).json({ error: "Campanha não encontrada" });
  }
});

app.post("/api/campanhas", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const nova = { _id: generateId(), ...req.body, arrecadado: 0, percentualConcluido: 0, doacoes: [] };
      demoData.campanhas.push(nova);
      return res.status(201).json(nova);
    }
    const nova = new Campanha(req.body);
    await nova.save();
    res.status(201).json(nova);
  } catch (error) {
    res.status(400).json({ error: "Erro ao salvar campanha" });
  }
});

app.put("/api/campanhas/:id", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const idx = demoData.campanhas.findIndex(c => c._id === req.params.id);
      if (idx === -1) return res.status(404).json({ error: "Campanha não encontrada" });
      demoData.campanhas[idx] = { ...demoData.campanhas[idx], ...req.body };
      return res.json(demoData.campanhas[idx]);
    }
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

    if (DEMO_MODE) {
      const doadorDoc = demoData.doadores.find(d => d._id === doadorFinal);
      if (doadorDoc) {
        if (doadorDoc.creditos < valor) {
          return res.status(400).json({ error: "Creditos insuficientes", creditos: doadorDoc.creditos });
        }
        doadorDoc.creditos -= valor;
      }
      const novaDoacao = { _id: generateId(), doador: doadorFinal, campanha: campanhaFinal, valor, pontosConcedidos: pontos, mensagem, criadoEm: new Date() };
      demoData.doacoes.push(novaDoacao);
      const txDoacao = { _id: generateId(), doador: doadorFinal, tipo: "doacao", valor: -valor, creditos: -valor, campanhaId: campanhaFinal, status: "concluido", criadoEm: new Date() };
      demoData.transacoes.push(txDoacao);

      const campDoc = demoData.campanhas.find(c => c._id === campanhaFinal);
      if (campDoc) {
        campDoc.arrecadado += valor;
        campDoc.percentualConcluido = (campDoc.arrecadado / campDoc.meta) * 100;
      }

      if (doadorDoc) {
        doadorDoc.pontos += pontos;
        doadorDoc.totalArrecadado += valor;
        doadorDoc.doacoes.push(novaDoacao._id);
        doadorDoc.nivel = Math.floor(doadorDoc.pontos / 500) + 1;
        if (!doadorDoc.badges.includes("impacto_inicial")) doadorDoc.badges.push("impacto_inicial");
        if (!doadorDoc.badges.includes("primeiro_passo")) doadorDoc.badges.push("primeiro_passo");
        if (doadorDoc.pontos >= 100 && !doadorDoc.badges.includes("heroi_solidario")) doadorDoc.badges.push("heroi_solidario");
        if (doadorDoc.pontos >= 1000 && !doadorDoc.badges.includes("benfeitor")) doadorDoc.badges.push("benfeitor");
      }
      return res.status(201).json(novaDoacao);
    }

    const doacao = new Doacao({ doador: doadorFinal, campanha: campanhaFinal, valor, pontosConcedidos: pontos, mensagem });
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
    res.status(400).json({ error: "Erro ao registrar doação" });
  }
});

app.get("/api/doacoes/doador/:id", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const doacoes = demoData.doacoes.filter(d => d.doador === req.params.id).map(d => ({
        ...d, campanha: demoData.campanhas.find(c => c._id === d.campanha) || null
      }));
      return res.json(doacoes);
    }
    const doacoes = await Doacao.find({ doador: req.params.id }).populate("campanha");
    res.json(doacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar doações" });
  }
});

app.get("/api/ranking", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    if (DEMO_MODE) {
      const ranking = [...demoData.doadores].sort((a, b) => b.pontos - a.pontos).slice(0, limit)
        .map(({ _id, nome, pontos, nivel, totalArrecadado, badges }) => ({ _id, nome, pontos, nivel, totalArrecadado, badges }));
      return res.json(ranking);
    }
    const ranking = await Doador.find().sort({ pontos: -1 }).limit(limit).select("nome pontos nivel totalArrecadado badges");
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

app.get("/api/doadores/ranking", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    if (DEMO_MODE) {
      const ranking = [...demoData.doadores].sort((a, b) => b.pontos - a.pontos).slice(0, limit)
        .map(({ _id, nome, pontos, nivel, totalArrecadado, badges }) => ({ _id, nome, pontos, nivel, totalArrecadado, badges }));
      return res.json(ranking);
    }
    const ranking = await Doador.find().sort({ pontos: -1 }).limit(limit).select("nome pontos nivel totalArrecadado badges");
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

app.get("/api/doadores/:id", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const doador = demoData.doadores.find(d => d._id === req.params.id);
      if (!doador) return res.status(404).json({ error: "Doador não encontrado" });
      return res.json(doador);
    }
    const doador = await Doador.findById(req.params.id).populate("doacoes");
    res.json(doador);
  } catch (error) {
    res.status(404).json({ error: "Doador não encontrado" });
  }
});

app.post("/api/doadores", async (req, res) => {
  try {
    if (!senhaEhForte(req.body.senha)) {
      return res.status(400).json({ error: "Senha precisa ter 8+ caracteres, incluindo maiúscula, minúscula, número e símbolo" });
    }
    if (DEMO_MODE) {
      const novoDoador = { _id: generateId(), ...req.body, pontos: 0, nivel: 1, creditos: 0, totalArrecadado: 0, badges: [], doacoes: [], metasPessoais: [] };
      demoData.doadores.push(novoDoador);
      return res.status(201).json(novoDoador);
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
    if (DEMO_MODE) {
      const doador = demoData.doadores.find(d => d.email === email);
      if (!doador || doador.senha !== senha) return res.status(401).json({ error: "Credenciais inválidas" });
      return res.json({ token: "demo-token", userId: doador._id });
    }
    const doador = await Doador.findOne({ email });
    if (!doador || doador.senha !== senha) return res.status(401).json({ error: "Credenciais inválidas" });
    res.json({ token: "demo-token", userId: doador._id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

app.get("/api/ongs", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const ongsPopuladas = demoData.ongs.map(o => ({ ...o, campanhas: demoData.campanhas.filter(c => c.ong === o._id) }));
      return res.json(ongsPopuladas);
    }
    const ongs = await ONG.find().populate("campanhas");
    res.json(ongs);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ONGs" });
  }
});

app.get("/api/ongs/:id", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const ong = demoData.ongs.find(o => o._id === req.params.id);
      if (!ong) return res.status(404).json({ error: "ONG não encontrada" });
      return res.json({ ...ong, campanhas: demoData.campanhas.filter(c => c.ong === ong._id) });
    }
    const ong = await ONG.findById(req.params.id).populate("campanhas");
    res.json(ong);
  } catch (error) {
    res.status(404).json({ error: "ONG não encontrada" });
  }
});

app.post("/api/ongs", async (req, res) => {
  try {
    if (!senhaEhForte(req.body.senha)) {
      return res.status(400).json({ error: "Senha precisa ter 8+ caracteres, incluindo maiúscula, minúscula, número e símbolo" });
    }
    if (DEMO_MODE) {
      const novaOng = { _id: generateId(), ...req.body, campanhas: [], totalArrecadado: 0, metasAlcancadas: 0, seguidores: 0 };
      demoData.ongs.push(novaOng);
      return res.status(201).json(novaOng);
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
    if (DEMO_MODE) {
      const ong = demoData.ongs.find(o => o.email === email);
      if (!ong || ong.senha !== senha) return res.status(401).json({ error: "Credenciais inválidas" });
      return res.json({ token: "demo-token", ongId: ong._id });
    }
    const ong = await ONG.findOne({ email });
    if (!ong || ong.senha !== senha) return res.status(401).json({ error: "Credenciais inválidas" });
    res.json({ token: "demo-token", ongId: ong._id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao autenticar" });
  }
});

app.get("/api/creditos/:doadorId", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const doador = demoData.doadores.find(d => d._id === req.params.doadorId);
      if (!doador) return res.status(404).json({ error: "Doador nao encontrado" });
      return res.json({ creditos: doador.creditos || 0 });
    }
    const doador = await Doador.findById(req.params.doadorId);
    if (!doador) return res.status(404).json({ error: "Doador nao encontrado" });
    res.json({ creditos: doador.creditos || 0 });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar creditos" });
  }
});

app.get("/api/transacoes/:doadorId", async (req, res) => {
  try {
    if (DEMO_MODE) {
      const transacoes = demoData.transacoes.filter(t => t.doador === req.params.doadorId);
      return res.json(transacoes.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)));
    }
    const transacoes = await Transacao.find({ doador: req.params.doadorId }).sort({ criadoEm: -1 });
    res.json(transacoes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar transacoes" });
  }
});

app.post("/api/gateway/iniciar", async (req, res) => {
  try {
    const { doadorId, valor, metodo } = req.body;
    if (!doadorId || !valor || valor < 10) {
      return res.status(400).json({ error: "Valor minimo: R$ 10" });
    }
    const txId = generateId();
    const transacao = {
      _id: txId,
      doador: doadorId,
      tipo: "compra",
      valor: valor,
      creditos: valor,
      metodo: metodo || "pix",
      status: "pendente",
      criadoEm: new Date()
    };
    if (DEMO_MODE) {
      demoData.transacoes.push(transacao);
      return res.json({ 
        transacaoId: txId, 
        status: "pendente",
        metodo: metodo || "pix",
        valor: valor,
        instrucoes: metodo === "pix" ? {
          chave: "pagamentos@causadigital.org",
          qrcode: "00020126580014br.gov.bcb.pix0136" + txId.substring(0,32),
          expiracao: "30 minutos"
        } : metodo === "boleto" ? {
          codigo: "23793.38128 60000.000003 " + txId.substring(5,15) + " 1 " + (valor * 100).toString().padStart(10, "0"),
          vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")
        } : {
          mensagem: "Processando pagamento com cartao..."
        }
      });
    }
    const tx = new Transacao(transacao);
    await tx.save();
    res.json({ transacaoId: txId, status: "pendente" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao iniciar pagamento" });
  }
});

app.post("/api/gateway/confirmar", async (req, res) => {
  try {
    const { transacaoId } = req.body;
    if (DEMO_MODE) {
      const tx = demoData.transacoes.find(t => t._id === transacaoId);
      if (!tx) return res.status(404).json({ error: "Transacao nao encontrada" });
      if (tx.status === "aprovado") return res.json({ status: "ja_aprovado", creditos: tx.creditos });
      tx.status = "aprovado";
      const doador = demoData.doadores.find(d => d._id === tx.doador);
      if (doador) {
        doador.creditos = (doador.creditos || 0) + tx.creditos;
      }
      return res.json({ 
        status: "aprovado", 
        creditos: tx.creditos, 
        saldoAtual: doador ? doador.creditos : tx.creditos,
        mensagem: "Pagamento confirmado! Creditos adicionados."
      });
    }
    const tx = await Transacao.findById(transacaoId);
    if (!tx) return res.status(404).json({ error: "Transacao nao encontrada" });
    tx.status = "aprovado";
    await tx.save();
    const doador = await Doador.findById(tx.doador);
    if (doador) {
      doador.creditos = (doador.creditos || 0) + tx.creditos;
      await doador.save();
    }
    res.json({ status: "aprovado", creditos: tx.creditos, saldoAtual: doador.creditos });
  } catch (error) {
    res.status(500).json({ error: "Erro ao confirmar pagamento" });
  }
});

app.post("/api/gateway/simular", async (req, res) => {
  try {
    const { doadorId, valor, metodo } = req.body;
    if (!doadorId || !valor || valor < 10) {
      return res.status(400).json({ error: "Valor minimo: R$ 10" });
    }
    const txId = generateId();
    const transacao = {
      _id: txId,
      doador: doadorId,
      tipo: "compra",
      valor: valor,
      creditos: valor,
      metodo: metodo || "pix",
      status: "aprovado",
      criadoEm: new Date()
    };
    if (DEMO_MODE) {
      demoData.transacoes.push(transacao);
      const doador = demoData.doadores.find(d => d._id === doadorId);
      if (doador) {
        doador.creditos = (doador.creditos || 0) + valor;
      }
      return res.json({ 
        status: "aprovado", 
        transacaoId: txId,
        creditos: valor, 
        saldoAtual: doador ? doador.creditos : valor,
        mensagem: "Pagamento simulado com sucesso!"
      });
    }
    const tx = new Transacao(transacao);
    await tx.save();
    const doador = await Doador.findById(doadorId);
    if (doador) {
      doador.creditos = (doador.creditos || 0) + valor;
      await doador.save();
    }
    res.json({ status: "aprovado", creditos: valor, saldoAtual: doador.creditos });
  } catch (error) {
    res.status(500).json({ error: "Erro ao simular pagamento" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
