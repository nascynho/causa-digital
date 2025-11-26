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
# ou, para desenvolvimento com hot reload
npm run dev
```

4. Acesse em `http://localhost:3000`

### Rodar em outra máquina ou com Mongo remoto

1. **Clonar o projeto**: `git clone` + `cd causa-digital`.
2. **Instalar dependências**: `npm install`.
3. **Provisionar MongoDB**:
   - Local: instale o MongoDB Community e deixe rodando em `mongodb://127.0.0.1:27017`.
   - Remoto (Atlas/Docker/servidor dedicado): anote o connection string completo incluindo usuário e senha.
4. **Configurar a URI**:
   - No arquivo `.env` (crie se não existir) coloque `MONGODB_URI=mongodb+srv://<user>:<senha>@<cluster>/<db>?retryWrites=true&w=majority`.
   - O `server.js` já lê `process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/causadigital'`, portanto basta exportar a variável antes de iniciar.
   - Exemplos de execução:
     - Windows PowerShell: `setx MONGODB_URI "mongodb://seu-host:27017/causadigital"` (abre novo terminal em seguida).
     - Linux/macOS: `export MONGODB_URI="mongodb://usuario:senha@ip-remoto:27017/causadigital"`.
5. **Validar conectividade**: use `mongosh <URI>` ou `node scripts/ping-mongo.js` (se criar) para garantir acesso.
6. **Executar o backend**: `npm start` (ou `npm run dev`). O log "MongoDB conectado com sucesso!" confirma a conexão.
7. **Expor a porta 3000**: Garanta que firewall/WSL liberou a porta. Em redes corporativas pode ser necessário tunelar via SSH.
8. **Testar endpoints**: `curl http://localhost:3000/api/health` deve retornar `{ status: "ok" }`. Use Insomnia/Postman para criar `POST /api/doadores` e `POST /api/ongs`.

> Dica: para ambientes compartilhados, crie um usuário Mongo restrito (`readWrite` no banco `causadigital`) e nunca exponha a senha no código; use apenas variáveis de ambiente.

### Popular banco com dados demo

1. Garanta que o MongoDB está executando e que a variável `MONGODB_URI` aponta para o host correto (ou use o padrão local).
2. Execute:

```bash
node scripts/seed.js
```

O script limpa as coleções e cadastra uma ONG, um doador, três campanhas e uma doação para demonstrar os relatórios.

### Plano de testes sugerido

- Consulte `TEST_PLAN.md` para ver os fluxos end-to-end que serão mostrados na apresentação (login doador, login ONG, criação de campanha, doação, landing page e fallback em caso de falha).
- Para automação, considere adicionar Cypress/Playwright seguindo as sugestões descritas no plano.

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

### Políticas sugeridas de senha

- No mínimo **8 caracteres** combinando letras maiúsculas, minúsculas, números e símbolos.
- Bloquear senhas em listas comuns (ex.: "123456", "password"). Pode-se usar bibliotecas como `hibp` ou um dicionário local.
- Rejeitar senhas iguais ao e-mail ou nome do usuário.
- Incentivar frase de senha (ex.: `Causa#2025!Impacto`).
- Para ambiente demo, aceitar senhas simples mas alertar o usuário (exibir tooltip). Em produção, aplicar validação no backend antes de salvar.
- Sempre **hash** das senhas: `bcrypt.hash(plain, saltRounds)` antes de persistir.
- **Importante**: a API já recusa cadastros que não respeitem o padrão mínimo (8+ caracteres com maiúscula, minúscula, número e símbolo).

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
