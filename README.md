# Catálogo Giovanna Depollo - Peças de Crochê

Site de catálogo profissional para exibir e vender peças de crochê artesanal.

## 🌟 Funcionalidades

- ✨ **Catálogo de Produtos**: Galeria elegante com todas as peças
- 🖼️ **Detalhes do Produto**: Múltiplas imagens, seleção de tamanho e cor
- 💬 **WhatsApp Integration**: Encomendas diretas via WhatsApp
- 👤 **Sobre**: Página com informações da artesã
- 📦 **Forma de Envio**: Informações completas sobre entrega
- 🔐 **Painel Admin**: Gerenciamento completo de produtos
- 🔑 **Login Google**: Autenticação segura via Google OAuth

## 🛠️ Tecnologias

### Frontend
- React 19
- Tailwind CSS
- Framer Motion (animações)
- React Router
- Shadcn/UI components

### Backend
- FastAPI (Python)
- MongoDB (banco de dados)
- Emergent Auth (Google OAuth)
- Motor (async MongoDB driver)

## 📦 Deploy

Este projeto está configurado para deploy gratuito em:
- **Frontend**: Netlify
- **Backend**: Render  
- **Banco de Dados**: MongoDB Atlas

### Guia Completo de Deploy

Leia o arquivo **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** para instruções passo a passo de como fazer deploy do projeto.

### Resumo Rápido:

1. **MongoDB Atlas** (Banco de Dados)
   - Crie cluster gratuito
   - Configure usuário e IP
   - Copie connection string

2. **Render** (Backend)
   - Conecte repositório GitHub
   - Configure variáveis de ambiente
   - Deploy automático

3. **Netlify** (Frontend)
   - Conecte repositório GitHub
   - Configure variável `REACT_APP_BACKEND_URL`
   - Deploy automático

## 🚀 Desenvolvimento Local

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## 📱 Estrutura do Projeto

```
.
├── backend/
│   ├── server.py           # API FastAPI
│   ├── requirements.txt    # Dependências Python
│   └── .env               # Variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── App.js         # Componente principal
│   │   └── App.css        # Estilos customizados
│   ├── public/            # Arquivos estáticos
│   └── package.json       # Dependências Node.js
│
├── netlify.toml           # Config Netlify
├── render.yaml            # Config Render
└── DEPLOYMENT_GUIDE.md    # Guia de deploy completo
```

## 🎨 Design

- **Cores Principais**: Azul (#1e3a8a), Branco, Dourado (#D4AF37)
- **Tipografia**: Playfair Display (títulos) + Manrope (corpo)
- **Layout**: Design elegante e clean, totalmente responsivo

## 📞 Contato

- **WhatsApp**: +55 28 99920-5102
- **Instagram**: @giovannadepollo

## 📄 Licença

© 2025 Giovanna Depollo. Todos os direitos reservados.

---

**Feito com ❤️ por Giovanna Depollo**
