# 💙 Causa Digital

Plataforma de doações gamificada com transparência total.

## 🚀 Como Rodar (Modo Demo)

**Funciona SEM MongoDB!** Ideal para apresentações.

```bash
npm install
npm run demo
```

Acesse: **http://localhost:3000**

## 👤 Contas de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Doador | maria@email.com | Demo@123 |
| Doador | joao@email.com | Demo@123 |
| ONG | contato@alimentacao.org | Demo@123 |
| ONG | contato@educacao.org | Demo@123 |

## ✨ Funcionalidades

- Sistema de Pontos (R$1 = 10 pontos)
- Níveis (500 pontos = 1 nível)
- Badges e Conquistas
- Ranking de Doadores
- Campanhas por Categoria
- Perfil com Histórico
- Painel de ONG
- Modo Escuro

## 🛠️ Tecnologias

- Node.js + Express
- MongoDB + Mongoose
- HTML5, CSS3, JavaScript

## 📁 Estrutura

```
causa-digital/
├── server.js          # Backend + API
├── package.json
└── public/
    ├── index.html     # Home
    ├── campanhas.html # Campanhas
    ├── doacao.html    # Doar
    ├── auth.html      # Login
    ├── cadastro.html  # Cadastro
    ├── perfil.html    # Perfil Doador
    ├── painel.html    # Painel ONG
    ├── ongs.html      # Lista ONGs
    ├── style.css
    └── auth-helper.js
```

## 🔧 Modo Produção (com MongoDB)

```bash
npm start
```

---

© 2025 Causa Digital - Gabriel e Cauã
