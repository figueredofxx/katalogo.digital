
# Guia de Infraestrutura: MongoDB + Node.js

Este sistema foi refatorado para usar uma arquitetura de 3 camadas:
1.  **Frontend:** React (SPA).
2.  **Backend:** Node.js + Express (API REST).
3.  **Database:** MongoDB.

## 1. Instalação no Servidor (Ubuntu 20.04)

### Passo 1.1: Instalar MongoDB
```bash
# Importar chave pública
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Criar lista de sources
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Atualizar e Instalar
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar serviço
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Passo 1.2: Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## 2. Configuração do Backend

O código do backend está na pasta `backend/server.js`. Você precisa configurá-lo para rodar como um serviço.

### Passo 2.1: Preparar Pastas
```bash
mkdir -p /var/www/backend
# Copie o arquivo backend/server.js para /var/www/backend/server.js
# Copie o package.json (crie um se não houver)
```

**Criar `package.json` no servidor:**
```bash
cd /var/www/backend
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
```

### Passo 2.2: Criar Serviço (PM2 ou Systemd)
Recomendamos usar PM2 para gerenciar o Node.js.

```bash
sudo npm install -g pm2
cd /var/www/backend
pm2 start server.js --name "katalogo-api"
pm2 save
pm2 startup
```

A API estará rodando em `http://localhost:3000`.

---

## 3. Configuração do Frontend (Nginx)

O Nginx precisa servir o React e fazer proxy das chamadas `/api` para o Node.js.

**Arquivo: `/etc/nginx/sites-available/katalogo`**

```nginx
server {
    listen 80;
    server_name katalogo.digital;

    root /var/www/katalogo/build;
    index index.html;

    # Frontend (React)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend (API Proxy)
    location /api/ {
        # Reescreve /api/auth para /api/auth no backend
        # O backend server.js já espera prefixo /api na rota?
        # No código fornecido: app.post('/api/auth/register') -> SIM.
        proxy_pass http://127.0.0.1:3000; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reinicie o Nginx:
```bash
sudo systemctl restart nginx
```

## 4. Variáveis de Ambiente (.env)

No backend (`/var/www/backend/.env`):
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/katalogo
JWT_SECRET=sua_chave_super_secreta_aqui
```
