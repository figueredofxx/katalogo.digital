# Katalogo - Sua Loja no WhatsApp

Plataforma SaaS para criação de lojas virtuais instantâneas com foco em vendas via WhatsApp.

## 🚀 Arquitetura

O projeto é dividido em duas partes principais:

1.  **Frontend (Raiz):** SPA desenvolvido em React, Vite e TailwindCSS.
2.  **Backend (`/backend`):** API REST em Node.js com Express e MongoDB.

## 🛠️ Instalação Local

### 1. Backend
```bash
cd backend
npm install
# Crie um arquivo .env com MONGO_URI e JWT_SECRET
npm run dev
```

### 2. Frontend
```bash
# Na raiz do projeto
npm install
npm run dev
```

## 📦 Deploy em Produção

Siga as instruções detalhadas no arquivo `MONGODB_GUIDE.md` para configurar o servidor Ubuntu 20.04 com Nginx, SSL e MongoDB.

## 📄 Estrutura de Pastas

*   `/src`: Código fonte do React (Páginas, Componentes, Hooks).
*   `/backend`: Código fonte da API Node.js.
*   `/scripts`: Scripts utilitários.

---
© 2025 Katalogo App