# Guia de Deploy - Giovanna Depollo Crochet

## Pré-requisitos

1. Conta no GitHub (para conectar aos serviços)
2. Conta na Netlify (grátis): https://netlify.com
3. Conta no Render (grátis): https://render.com
4. Conta no MongoDB Atlas (grátis): https://mongodb.com/atlas

---

## PARTE 1: Configurar MongoDB Atlas (Banco de Dados)

### Passo 1: Criar Cluster MongoDB
1. Acesse https://mongodb.com/atlas/database
2. Clique em **"Build a Database"**
3. Selecione **FREE (M0)** 
4. Escolha região **AWS / São Paulo (sa-east-1)** (mais próximo do Brasil)
5. Clique em **"Create"**

### Passo 2: Configurar Acesso
1. Em **Security > Database Access**, clique **"Add New Database User"**
   - Username: `giovanna_admin`
   - Password: (crie uma senha forte e GUARDE)
   - Database User Privileges: **"Read and write to any database"**
   - Clique **"Add User"**

2. Em **Security > Network Access**, clique **"Add IP Address"**
   - Clique **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Clique **"Confirm"**

### Passo 3: Obter Connection String
1. Clique em **"Connect"** no seu cluster
2. Escolha **"Connect your application"**
3. Copie a string de conexão (parecida com):
   ```
   mongodb+srv://giovanna_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. **IMPORTANTE**: Substitua `<password>` pela senha que você criou
5. **GUARDE essa string** - você vai precisar!

---

## PARTE 2: Deploy do Backend no Render

### Passo 1: Fazer Push do Código para GitHub
1. Crie um repositório no GitHub
2. Faça push do código (use a opção "Save to GitHub" do Emergent se disponível)

### Passo 2: Conectar no Render
1. Acesse https://render.com
2. Clique em **"New +"** > **"Web Service"**
3. Conecte seu repositório GitHub
4. Selecione o repositório do projeto

### Passo 3: Configurar o Serviço
```
Name: giovanna-depollo-api
Region: Oregon (US West) ou Frankfurt (Europe)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Passo 4: Adicionar Variáveis de Ambiente
Em **"Environment Variables"**, adicione:

```
MONGO_URL = mongodb+srv://giovanna_admin:SUA_SENHA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME = giovanna_depollo_db
CORS_ORIGINS = *
```

### Passo 5: Deploy
1. Clique em **"Create Web Service"**
2. Aguarde o deploy (3-5 minutos)
3. Quando terminar, copie a URL do seu backend:
   - Será algo como: `https://giovanna-depollo-api.onrender.com`
4. **GUARDE essa URL!**

---

## PARTE 3: Deploy do Frontend na Netlify

### Passo 1: Conectar no Netlify
1. Acesse https://netlify.com
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Conecte ao GitHub e selecione seu repositório

### Passo 2: Configurar Build
```
Base directory: frontend
Build command: yarn install && yarn build
Publish directory: frontend/build
```

### Passo 3: Adicionar Variável de Ambiente
Em **"Site settings"** > **"Environment variables"**, adicione:

```
REACT_APP_BACKEND_URL = https://giovanna-depollo-api.onrender.com
```

**IMPORTANTE**: Use a URL do Render que você copiou no Passo 2!

### Passo 4: Deploy
1. Clique em **"Deploy site"**
2. Aguarde o build (2-3 minutos)
3. Seu site estará disponível em uma URL como:
   - `https://giovanna-depollo.netlify.app`

### Passo 5: Configurar Domínio Personalizado (Opcional)
1. Em **"Site settings"** > **"Domain management"**
2. Clique **"Add custom domain"**
3. Digite seu domínio (ex: `giovannadepollo.com`)
4. Siga as instruções para configurar DNS

---

## PARTE 4: Atualizar CORS no Backend

### Depois do deploy, atualize a variável de ambiente no Render:

1. Vá no Render Dashboard > Seu serviço
2. Edite a variável **CORS_ORIGINS**:
   ```
   CORS_ORIGINS = https://giovanna-depollo.netlify.app,https://seu-dominio.com
   ```
3. Salve e aguarde o redeploy automático

---

## ✅ TESTE FINAL

1. Acesse seu site na Netlify
2. Verifique se o catálogo carrega
3. Teste o botão WhatsApp em um produto
4. Acesse `/login` e faça login com Google
5. No painel admin, adicione um produto de teste
6. Volte ao catálogo e veja se o produto aparece

---

## 🔧 Troubleshooting

### Erro: "Failed to fetch products"
- Verifique se a variável `REACT_APP_BACKEND_URL` está correta
- Verifique se o backend está rodando no Render
- Verifique os logs do Render

### Erro: "CORS"
- Atualize `CORS_ORIGINS` no Render com a URL do Netlify
- Aguarde redeploy

### Erro de Autenticação
- Verifique se o MongoDB está acessível
- Verifique se `MONGO_URL` está correto

---

## 💡 Próximos Passos

1. **Domínio Personalizado**: Configure em Netlify e Render
2. **SSL/HTTPS**: Automático na Netlify
3. **Backup**: MongoDB Atlas faz backup automático
4. **Monitoramento**: Use Render Dashboard para ver logs

---

## 📊 Custos

- **Netlify**: Grátis (100GB bandwidth/mês)
- **Render**: Grátis (750 horas/mês, dorme após inatividade)
- **MongoDB Atlas**: Grátis (512MB storage)

**NOTA**: O plano grátis do Render "dorme" após 15min de inatividade. Primeiro acesso pode demorar ~30s.

---

## 🆘 Suporte

Se tiver problemas:
1. Verifique os logs no Render
2. Verifique o console do navegador (F12)
3. Teste o backend diretamente: `https://seu-backend.onrender.com/api/products`

---

**Boa sorte com o deploy! 🚀**