# 💚 Causa Digital - Plataforma de Doações Gamificada

> Uma plataforma inovadora de doações com **transparência total**, **gamificação** e **integração completa** entre doadores e ONGs.

## 📋 Sumário Executivo

- ✅ **Front-end**: 11 páginas HTML + CSS + JavaScript puro
- ✅ **Back-end**: Express.js com 15+ endpoints REST
- ✅ **Banco de Dados**: MongoDB com Mongoose (ou modo demo)
- ✅ **Gamificação**: Pontos, níveis, badges e ranking
- ✅ **Responsivo**: Mobile-first design
- ✅ **Tema**: Paleta verde (esperança, doação)

## 🚀 Instalação e Execução

### Modo Demo (SEM MongoDB)
```bash
npm install
npm run demo
# Acesse: http://localhost:3000
```

### Modo Produção (COM MongoDB)
```bash
npm install
npm start
```

## 👤 Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Doador | maria@email.com | Demo@123 |
| Doador | joao@email.com | Demo@123 |
| ONG | contato@alimentacao.org | Demo@123 |
| ONG | contato@educacao.org | Demo@123 |

## 🎯 Funcionalidades Principais

### Para Doadores
- 💳 Compra de créditos
- 💚 Doações com feedback em tempo real
- ⭐ Acúmulo de pontos (1 crédito = 10 pontos)
- 🏆 Sistema de níveis (500 pontos = 1 nível)
- 🎖️ Desbloqueio de badges e conquistas
- 📊 Ranking semanal de doadores
- 📱 Perfil com histórico de doações

### Para ONGs
- 📢 Criação e gerenciamento de campanhas
- 📈 Acompanhamento de arrecadação em tempo real
- 👥 Base de doadores engajados
- 📊 Dashboard com estatísticas
- 🎯 Metas por campanha

## 🏗️ Arquitetura

### Front-end
```
public/
├── index.html          → Landing page com estatísticas
├── campanhas.html      → Listagem com filtros
├── doacao.html         → Fluxo de doação completo
├── cadastro.html       → Registro (doador/ONG)
├── auth.html           → Login
├── perfil.html         → Perfil do doador
├── painel.html         → Dashboard da ONG
├── creditos.html       → Compra de créditos
├── ongs.html           → Listagem de ONGs
├── style.css           → Estilos globais (1000+ linhas)
└── auth-helper.js      → Utilitários (Toast, Loading, API, Validators)
```

### Back-end
```
server.js
├── Schemas: Doador, ONG, Campanha, Doação, Transação
├── 15+ endpoints REST
├── Modo demo com dados em memória
└── Suporte a MongoDB (Mongoose)
```

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Utilities**: Cors, Dotenv

## 📊 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Status da API |
| GET | `/api/stats` | Estatísticas da plataforma |
| GET | `/api/campanhas` | Listar campanhas |
| POST | `/api/doacoes` | Registrar doação |
| GET | `/api/ranking` | Ranking de doadores |
| POST | `/api/doadores` | Criar doador |
| POST | `/api/ongs` | Criar ONG |

## 🎨 Tema Visual

- **Paleta**: Verde (esperança, doação) + Brancos/Cinzas
- **Modo claro/escuro**: Suportado
- **Animações**: Suaves (fadeIn, fadeInUp, slideInRight, pulse)
- **Componentes**: Cards, badges, modais, toast notifications

## ✨ Destaques Técnicos

- ✅ Validação em tempo real de formulários
- ✅ Indicador de força de senha
- ✅ Sistema de Toast notifications
- ✅ Contador animado de estatísticas
- ✅ Confetti em doações bem-sucedidas
- ✅ Responsivo (mobile-first)
- ✅ Acessibilidade (WCAG)
- ✅ SEO otimizado

## 📝 Estrutura do Projeto

```
causa-digital/
├── server.js           ← Backend (Express + Mongoose)
├── package.json        ← Dependências
├── .env.example        ← Variáveis de ambiente
├── README.md           ← Esta documentação
└── public/             ← Frontend (tudo aqui)
    ├── *.html
    ├── style.css
    └── auth-helper.js
```

## 🚢 Deploy

Pronto para deploy em:
- Heroku (com MongoDB Atlas)
- Railway
- Vercel (frontend) + Heroku (backend)
- Docker (em progresso)
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
