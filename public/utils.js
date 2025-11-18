// ==================== UTILIDADES GERAIS ====================

function initDarkMode() {
  const btn = document.getElementById("modoBtn");
  const body = document.body;
  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    if (btn) btn.textContent = "Sol";
  }
  if (btn) {
    btn.addEventListener("click", () => {
      body.classList.toggle("dark");
      const dark = body.classList.contains("dark");
      localStorage.setItem("theme", dark ? "dark" : "light");
      btn.textContent = dark ? "Sol" : "Modo";
    });
  }
}

// Formatacao de Moeda
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Formatacao de Data
function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Calcular Percentual
function calcularPercentual(atual, total) {
  return Math.min((atual / total) * 100, 100);
}

// Ícone por Categoria
const categoryIcons = {
  alimentacao: 'A',
  saude: 'S',
  educacao: 'E',
  abrigo: 'Ab',
  outro: 'O'
};

// Ícone por Badge
const badgeIcons = {
  primeiro_passo: '1P',
  heroi_solidario: 'HS',
  benfeitor: 'B'
};

// ==================== API CALLS ====================

// Buscar Campanhas
async function buscarCampanhas() {
  try {
    const res = await fetch("/api/campanhas");
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
    return [];
  }
}

// Buscar Doador
async function buscarDoador(id) {
  try {
    const res = await fetch(`/api/doadores/${id}`);
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar doador:", error);
    return null;
  }
}

// Buscar Ranking
async function buscarRanking() {
  try {
    const res = await fetch("/api/doadores/ranking");
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return [];
  }
}

// Criar Doação
async function criarDoacao(doadorId, campanhaId, valor, mensagem) {
  try {
    const res = await fetch("/api/doacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doadorId,
        campanhaId,
        valor,
        mensagem
      })
    });
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar doação:", error);
    return null;
  }
}

// Criar ONG
async function criarOng(dados) {
  try {
    const res = await fetch("/api/ongs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar ONG:", error);
    return null;
  }
}

// Criar Doador
async function criarDoador(dados) {
  try {
    const res = await fetch("/api/doadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar doador:", error);
    return null;
  }
}

// Inicializar na carga da página
document.addEventListener("DOMContentLoaded", initDarkMode);
