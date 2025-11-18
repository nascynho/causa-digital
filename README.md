# Causa Digital - Plataforma de Doacoes

Plataforma web para conectar doadores com ONGs, com sistema de gamificacao para aumentar engajamento.

## Funcionalidades

- **Sistema de Pontos**: 1 real = 10 pontos
- **Niveis**: A cada 500 pontos, suba de nivel
- **Badges**: Desbloqueie conquistas (Primeiro Passo, Heroi Solidario, Benfeitor)
- **Ranking**: Veja os top doadores em tempo real
- **Campanhas**: Organize doacoes por categoria (alimentacao, saude, educacao, abrigo)
- **Perfil**: Acompanhe seu historico de doacoes e metas pessoais
- **Dark Mode**: Interface responsiva com modo escuro
- **Painel ONG**: Dashboard para criar e gerenciar campanhas

## Tecnologia

- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Frontend**: HTML5, CSS3, JavaScript
- **Autenticacao**: localStorage (JWT recomendado para producao)

## Instalacao

### Requisitos
- Node.js 16+
- MongoDB local ou conexao Atlas

### Setup

1. Clone o repositorio
```bash
git clone <repo-url>
cd causa-digital
```

2. Instale as dependencias
```bash
npm install
```

3. Inicie o servidor
```bash
npm start
```

4. Acesse em `http://localhost:3000`

## Estrutura de Pastas

```
causa-digital/
├── server.js                 # Backend principal
├── public/
│   ├── index.html           # Homepage
│   ├── campanhas.html       # Lista de campanhas
│   ├── perfil.html          # Perfil do doador
│   ├── painel.html          # Dashboard da ONG
│   ├── auth.html            # Autenticacao
│   ├── style.css            # Estilos
│   └── utils.js             # Funcoes uteis
├── models/                   # Modelos de dados
├── routes/                   # Rotas da API
└── package.json
```

## API Endpoints

### Campanhas
- `GET /api/campanhas` - Listar todas
- `GET /api/campanhas/:id` - Detalhes
- `POST /api/campanhas` - Criar
- `PUT /api/campanhas/:id` - Atualizar

### Doacoes
- `POST /api/doacoes` - Registrar doacao
- `GET /api/doacoes/doador/:id` - Historico do doador

### Doadores
- `GET /api/doadores/ranking` - Top 10 doadores
- `GET /api/doadores/:id` - Perfil do doador
- `POST /api/doadores` - Criar doador

### ONGs
- `GET /api/ongs` - Listar ONGs
- `POST /api/ongs` - Criar ONG
- `GET /api/ongs/:id` - Detalhes da ONG

## Schemas

### Doador
```
{
  nome: String,
  email: String,
  senha: String,
  pontos: Number,
  nivel: Number,
  totalArrecadado: Number,
  badges: [String],
  doacoes: [ObjectId],
  metasPessoais: Array
}
```

### Campanha
```
{
  titulo: String,
  descricao: String,
  categoria: String,
  meta: Number,
  arrecadado: Number,
  percentualConcluido: Number,
  impactoDescricao: String,
  ong: ObjectId,
  doacoes: [ObjectId]
}
```

### Doacao
```
{
  doador: ObjectId,
  campanha: ObjectId,
  valor: Number,
  pontosConcedidos: Number,
  mensagem: String,
  criadoEm: Date
}
```

### ONG
```
{
  nome: String,
  email: String,
  descricao: String,
  campanhas: [ObjectId],
  totalArrecadado: Number,
  seguidores: Number
}
```

## Seguranca

Para producao:
- Implementar autenticacao JWT
- Usar bcrypt para senhas
- Validar todas as entradas
- Implementar rate limiting
- HTTPS obrigatorio

## Dark Mode

O modo escuro e persistido em localStorage:
```javascript
localStorage.getItem('theme') // 'dark' ou 'light'
```

## Customizacao

### Cores (CSS)
Edite as variaveis em `style.css`:
```css
:root {
  --accent: #06b6d4;
  --purple: #8b5cf6;
  --pink: #ec4899;
}
```

### Categorias
Edite o enum em `server.js`:
```javascript
categoria: { type: String, enum: ["alimentacao", "saude", "educacao", "abrigo", "outro"] }
```

### Sistema de Pontos
Edite em `server.js`:
```javascript
const pontos = valor * 10;
doador.nivel = Math.floor(doador.pontos / 500) + 1;
```

## Proximos Passos

- Implementar JWT authentication
- Integrar payment gateway
- Adicionar email notifications
- Deploy em producao
- Testes automatizados

## Licenca

MIT
