
# 🚀 Roteiro de Instalação Automatizada (Ubuntu 20.04)

**Status:** Logado como ROOT.
**Objetivo:** Instalar Stack MERN (MongoDB, Express, React, Node) + Nginx + SSL.

**⚠️ VARIÁVEIS PARA SUBSTITUIR ANTES DE EXECUTAR:**
*   `REPO_URL`: **[COLE_SEU_LINK_DO_GITHUB_AQUI]**
*   `DOMAIN`: **[SEU_DOMINIO.COM]** (Ex: katalogo.digital)
*   `JWT_SECRET`: **[GERE_UMA_SENHA_FORTE]**

---

## 1. Atualização e Instalação de Ferramentas Base
Execute o bloco abaixo para atualizar o sistema e instalar git, curl e compiladores.

```bash
apt-get update && apt-get upgrade -y
apt-get install -y curl git build-essential unzip gnupg
```

## 2. Instalação do MongoDB 7.0 (Latest Community)
Configuração específica para Ubuntu 20.04 (Focal).

```bash
# Importar chave GPG
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Adicionar repositório
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | \
   tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Instalar e Iniciar
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

## 3. Instalação do Node.js v20 (LTS) e PM2
Usando repositório oficial NodeSource.

```bash
# Baixar script de setup (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# Instalar Node e PM2 globalmente
apt-get install -y nodejs
npm install -g pm2
```

## 4. Clonagem do Repositório e Setup de Pastas

```bash
# Substitua a URL abaixo pelo seu repositório real
REPO_URL="[COLE_SEU_LINK_DO_GITHUB_AQUI]"

# Preparar diretório
mkdir -p /var/www
cd /var/www

# Clonar (se a pasta já existir, remove antes para garantir instalação limpa)
rm -rf katalogo
git clone $REPO_URL katalogo
cd katalogo
```

## 5. Configuração do Backend (API)

```bash
cd backend

# Instalar dependências
npm install

# Criar arquivo .env de Produção
# Substitua o JWT_SECRET abaixo
cat > .env <<EOF
PORT=3000
MONGO_URI=mongodb://localhost:27017/katalogo
JWT_SECRET=[GERE_UMA_SENHA_FORTE]
EOF

# Iniciar API com PM2
pm2 delete katalogo-api || true
pm2 start server.js --name "katalogo-api"
pm2 save
pm2 startup

# Teste rápido se API subiu
curl http://localhost:3000/api/auth/me || echo "API rodando (esperado 401 ou 404, não Connection Refused)"
```

## 6. Configuração do Frontend (Build React)

```bash
# Voltar para raiz do projeto
cd /var/www/katalogo

# Instalar dependências do Frontend
npm install

# Criar arquivo .env do Frontend
# O VITE_API_URL deve ser /api pois usaremos proxy reverso no Nginx
cat > .env <<EOF
VITE_API_URL=/api
EOF

# Gerar Build de Produção (Gera pasta 'build')
npm run build
```

## 7. Configuração do Nginx (Servidor Web & Proxy)

```bash
# Instalar Nginx
apt-get install -y nginx

# Definir domínio
DOMAIN="[SEU_DOMINIO.COM]"

# Criar configuração do site
cat > /etc/nginx/sites-available/katalogo <<EOF
server {
    listen 80;
    server_name $DOMAIN *.$DOMAIN;

    root /var/www/katalogo/build;
    index index.html;

    # Compressão Gzip para velocidade
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Rota Principal (SPA React)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy Reverso para a API (Backend)
    location /api/ {
        proxy_pass http://127.0.0.1:3000; # Encaminha para o Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    # Cache para arquivos estáticos
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
EOF

# Ativar site e remover padrão
rm -f /etc/nginx/sites-enabled/default
ln -s /etc/nginx/sites-available/katalogo /etc/nginx/sites-enabled/

# Testar e Reiniciar Nginx
nginx -t && systemctl restart nginx
```

## 8. Configuração SSL (HTTPS com Certbot)

```bash
# Instalar Certbot via Snap (Recomendado oficial)
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

# Gerar Certificado (Interativo - A IA deve rodar este comando e aceitar os termos)
# Se quiser 100% automático adicione --non-interactive --agree-tos -m seu@email.com
certbot --nginx -d $DOMAIN
```

## 9. Verificação Final

Se tudo correu bem:
1.  **Frontend:** Acesse `https://[SEU_DOMINIO.COM]`. Deve carregar a Landing Page.
2.  **Sistema:** Acesse `https://app.[SEU_DOMINIO.COM]`. Deve carregar o Login.
3.  **API:** O Nginx está redirecionando `/api` para o Node.js na porta 3000.
4.  **Banco:** O MongoDB está rodando e aceitando conexões locais.

**Parabéns! O sistema está em produção.** 🚀
