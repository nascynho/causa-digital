# Tutorial: Push do Projeto para GitHub

## Passo 1: Verificar se Git está instalado

Abra o PowerShell e rode:
```powershell
git --version
```

Se não aparecer uma versão, baixe em: https://git-scm.com/download/win

---

## Passo 2: Configurar Git (primeira vez apenas)

Configure seu nome e email:
```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@gmail.com"
```

---

## Passo 3: Ir até a pasta do projeto

```powershell
cd "c:\Users\gabriel e caua\Desktop\causa-digital"
```

---

## Passo 4: Inicializar repositório Git (se não existir .git)

```powershell
git init
```

---

## Passo 5: Adicionar arquivo .gitignore

Crie um arquivo chamado `.gitignore` na raiz do projeto com este conteudo:

```
node_modules/
.env
.DS_Store
*.log
dist/
build/
```

---

## Passo 6: Adicionar todos os arquivos

```powershell
git add .
```

---

## Passo 7: Criar primeiro commit

```powershell
git commit -m "Initial commit: Causa Digital - Plataforma de Doacoes Gamificada"
```

---

## Passo 8: Conectar ao repositório remoto GitHub

Use este comando (substitua `seu-usuario` pelo seu usuário do GitHub):

```powershell
git remote add origin https://github.com/seu-usuario/causa-digital.git
```

Para verificar se funcionou:
```powershell
git remote -v
```

---

## Passo 9: Fazer Push para o GitHub

```powershell
git branch -M main
git push -u origin main
```

Se pedir autenticacao, use seu token do GitHub:
- **Username**: seu-usuario-github
- **Password**: seu-token-pessoal

---

## Como Gerar Token no GitHub (se necessario)

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" (classic)
3. Marque as opcoes:
   - [x] repo (todos os subitens)
   - [x] workflow
4. Clique em "Generate token"
5. **Copie e guarde o token** (so aparece uma vez!)
6. Use esse token como senha no passo 9

---

## Atualizacoes Futuras

Quando fizer mudancas e quiser enviar para o GitHub:

```powershell
# 1. Adicione os arquivos
git add .

# 2. Faça commit com mensagem
git commit -m "Descricao das mudancas"

# 3. Faça push
git push
```

---

## Verificar Status do Repositorio

A qualquer momento, veja o status:
```powershell
git status
```

---

## Troubleshooting

### Erro: "fatal: remote origin already exists"
Delete e adicione novamente:
```powershell
git remote remove origin
git remote add origin https://github.com/seu-usuario/causa-digital.git
```

### Erro: "Permission denied"
Use um token do GitHub em vez de senha (veja acima)

### Erro: "fatal: not a git repository"
Certifique-se de estar na pasta certa e rode:
```powershell
git init
```

---

## Estrutura Esperada no GitHub

Apos fazer push, seu repositorio deve ter:
```
causa-digital/
├── server.js
├── package.json
├── README.md
├── .gitignore
├── public/
│   ├── index.html
│   ├── campanhas.html
│   ├── perfil.html
│   ├── painel.html
│   ├── auth.html
│   ├── style.css
│   ├── scripts.js
│   └── utils.js
├── models/
├── routes/
└── node_modules/ (ignorado pelo .gitignore)
```

---

**Pronto! Seu projeto estara no GitHub!** 🚀
