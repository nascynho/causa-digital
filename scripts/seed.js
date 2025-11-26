import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/causadigital";

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
  }]
});

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
  seguidores: { type: Number, default: 0 }
});

const campanhaSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  categoria: String,
  meta: Number,
  imagem: String,
  ong: { type: mongoose.Schema.Types.ObjectId, ref: "ONG" },
  arrecadado: { type: Number, default: 0 },
  percentualConcluido: { type: Number, default: 0 },
  impactoDescricao: String
});

const doacaoSchema = new mongoose.Schema({
  doador: { type: mongoose.Schema.Types.ObjectId, ref: "Doador" },
  campanha: { type: mongoose.Schema.Types.ObjectId, ref: "Campanha" },
  valor: Number,
  pontosConcedidos: Number,
  mensagem: String
});

const Doador = mongoose.model("Doador", doadorSchema);
const ONG = mongoose.model("ONG", ongSchema);
const Campanha = mongoose.model("Campanha", campanhaSchema);
const Doacao = mongoose.model("Doacao", doacaoSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Conectado ao MongoDB");

    await Promise.all([
      Doador.deleteMany({}),
      ONG.deleteMany({}),
      Campanha.deleteMany({}),
      Doacao.deleteMany({})
    ]);

    const ong = await ONG.create({
      nome: "Instituto Semeia",
      email: "contato@semeia.org",
      senha: "123456",
      descricao: "ONG focada em segurança alimentar de crianças",
      logo: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=200&h=200&fit=crop",
      website: "https://semeia.org",
      seguidores: 420
    });

    const campanhas = await Campanha.insertMany([
      {
        titulo: "Merenda para 200 crianças",
        descricao: "Compra de cestas frescas para escolas comunitárias.",
        categoria: "alimentacao",
        meta: 5000,
        arrecadado: 3200,
        impactoDescricao: "Mantém 200 crianças alimentadas por um mês",
        imagem: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=250&fit=crop",
        ong: ong._id,
        percentualConcluido: 64
      },
      {
        titulo: "Reforma do abrigo Esperança",
        descricao: "Troca do telhado e instalações elétricas",
        categoria: "abrigo",
        meta: 12000,
        arrecadado: 8700,
        impactoDescricao: "Protege 40 famílias contra chuvas",
        imagem: "https://images.unsplash.com/photo-1570051008600-b34baa49e751?w=400&h=250&fit=crop",
        ong: ong._id,
        percentualConcluido: 73
      },
      {
        titulo: "Kits de higiene para a rua",
        descricao: "Distribuição mensal para 150 pessoas",
        categoria: "saude",
        meta: 2000,
        arrecadado: 450,
        impactoDescricao: "Reduz riscos de infecção",
        imagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop",
        ong: ong._id,
        percentualConcluido: 22
      }
    ]);

    const doador = await Doador.create({
      nome: "Ana Silva",
      email: "ana@exemplo.com",
      senha: "123456",
      pontos: 1250,
      nivel: 5,
      totalArrecadado: 125,
      badges: ["primeiro_passo", "heroi_solidario"],
      metasPessoais: [{ nome: "Impacto em alimentação", valor: 1000, arrecadado: 320, categoria: "alimentacao" }]
    });

    const doacao = await Doacao.create({
      doador: doador._id,
      campanha: campanhas[0]._id,
      valor: 250,
      pontosConcedidos: 2500,
      mensagem: "Com carinho para as crianças"
    });

    doador.doacoes = [doacao._id];
    doador.totalArrecadado += doacao.valor;
    await doador.save();

    campanhas[0].arrecadado += doacao.valor;
    campanhas[0].percentualConcluido = (campanhas[0].arrecadado / campanhas[0].meta) * 100;
    await campanhas[0].save();

    console.log("Seed executado com sucesso.");
  } catch (error) {
    console.error("Erro ao rodar seed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
