# Plano de Testes E2E — Causa Digital

Este documento lista os fluxos críticos que devem ser demonstrados na apresentação e como verificá-los manualmente ou via automação (Cypress/Playwright).

## Preparação

1. Execute `npm install` e garanta o MongoDB rodando localmente ou via Atlas (`MONGODB_URI`).
2. Rode `npm run dev` para subir o servidor com hot reload.
3. Opcional: popular o banco com `node scripts/seed.js` para ter dados visíveis antes dos testes.

## Fluxos Prioritários

### 1. Autenticação do Doador
- **Passos**: `auth.html` → aba "Sou Doador" → preencher credenciais seed (`ana@exemplo.com` / `123456`).
- **Expectativa**: Feedback "Login aprovado" e redirecionamento para `perfil.html`. Painel deve mostrar pontos/badges e sugestão de próximo passo.
- **Validações**: `localStorage.userType === 'doador'`, requisição `GET /api/doadores/:id` retorna 200.

### 2. Autenticação da ONG + Criação de Campanha
- **Passos**: `auth.html` → aba "Sou ONG" → `contato@semeia.org` / `123456` → `painel.html`.
- **Criar campanha** preenchendo todos os campos e enviar.
- **Expectativa**: Alert de sucesso e nova campanha aparece em "Minhas Campanhas" e em `campanhas.html`.
- **Validações**: `POST /api/campanhas` responde 201, painel stats atualizados.

### 3. Doação e Atualização de Métricas
- **Passos**: Em `campanhas.html`, escolher campanha → `doacao.html?id=...` (ou via REST `POST /api/doacoes`).
- **Expectativa**: Barra de progresso aumenta, perfil do doador mostra nova linha em histórico e pontos aumentam.
- **Validações**: `GET /api/doacoes/doador/:id` inclui a doação; `Campanha.arrecadado` incrementado.

### 4. Ranking e Destaques na Landing Page
- **Passos**: Abrir `index.html` com API ativa.
- **Expectativa**: Badge "API: conectado" verde, cards carregados a partir de `/api/campanhas/destaques` e `/api/ranking` (sem cair no mock).
- **Validações**: Network log sem 404, skeletons substituídos por cards reais.

### 5. Persistência de Tema
- **Passos**: Alternar dark mode no canto superior direito e recarregar página.
- **Expectativa**: Escolha mantida usando `localStorage.theme`.

### 6. Resiliência a Falhas do Backend (cenário negativo)
- **Passos**: Parar Mongo ou apontar `MONGODB_URI` incorreto, atualizar página.
- **Expectativa**: Badge API fica vermelho, landing usa dados mockados sem quebrar layout.

## Automação Sugerida (Cypress)

Crie specs em `cypress/e2e`:
- `auth_doador.cy.js`: visita `auth.html`, envia formulário, valida URL e `localStorage`.
- `painel_ong.cy.js`: simula login ONG, cria campanha mock usando intercept.
- `landing_status.cy.js`: intercepta `/api/health` e valida badge conforme resposta.

## Smoke Checklist antes da apresentação

- [ ] `npm run dev` inicializa sem erros.
- [ ] `GET /api/health` retorna `{ status: "ok" }`.
- [ ] Seed executado ou base com registros reais.
- [ ] Fluxo doador, ONG e landing testados no navegador.
- [ ] README e este plano disponíveis no repositório.
