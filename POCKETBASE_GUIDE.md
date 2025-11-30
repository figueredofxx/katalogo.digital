
# Guia de Instalação e Deploy - Katalogo (PocketBase + React)

Este guia foi desenhado para ser seguido por uma IA ou SysAdmin para configurar um servidor **Ubuntu 20.04** "limpo" do zero.

**Arquitetura:**
*   **Backend:** PocketBase (Porta 8090) - Banco de Dados + Auth + API.
*   **Frontend:** React SPA (Porta 80 via Nginx).
*   **SSL:** Gerenciado pelo Cloudflare (Modo Full ou Flexível). Nginx escuta na porta 80.

---

## 1. Preparação do Sistema

Acesse o servidor via SSH (root) e atualize os pacotes.

```bash
# Atualizar lista de pacotes e sistema
apt update && apt upgrade -y

# Instalar dependências básicas
apt install -y curl git nginx unzip
```

## 2. Instalar Node.js (v18+)

Necessário para rodar o script de setup e fazer o build do Frontend.

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verificar instalação
node -v
npm -v
```

## 3. Instalar e Configurar PocketBase

O PocketBase será o cérebro do sistema.

```bash
# Criar diretório
mkdir -p /var/www/backend
cd /var/www/backend

# Baixar PocketBase (Linux AMD64)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.3/pocketbase_0.22.3_linux_amd64.zip

# Descompactar
unzip pocketbase_0.22.3_linux_amd64.zip
rm pocketbase_0.22.3_linux_amd64.zip

# Dar permissão de execução
chmod +x pocketbase
```

### 3.1 Criar Serviço do Systemd (Para rodar sempre)

Crie o arquivo de serviço:
`nano /etc/systemd/system/pocketbase.service`

Cole o conteúdo abaixo:

```ini
[Unit]
Description=PocketBase
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/var/www/backend
ExecStart=/var/www/backend/pocketbase serve --http="127.0.0.1:8090"
Restart=always

[Install]
WantedBy=multi-user.target
```

Ative e inicie o serviço:

```bash
systemctl daemon-reload
systemctl enable pocketbase
systemctl start pocketbase

# Verificar se está rodando (deve estar verde/active)
systemctl status pocketbase
```

### 3.2 Criar Conta Admin (Obrigatório)

Antes de rodar o script de automação, você precisa criar o primeiro admin.
Como o PocketBase está na porta 8090 e bloqueado pelo firewall (provavelmente), use este comando SSH local para criar o admin via terminal:

```bash
cd /var/www/backend
./pocketbase admin create admin@katalogo.digital 1234567890
```
*Anote esse email e senha.*

---

## 4. Configurar Banco de Dados (Automático)

Em vez de criar as tabelas manualmente, usaremos o script de automação incluído no projeto.

1.  Baixe o código do projeto (Passo 5).
2.  Navegue até a pasta do projeto: `cd /var/www/katalogo`.
3.  Edite o arquivo `scripts/pb_schema_init.js` para colocar o email e senha que você criou no passo 3.2.
    `nano scripts/pb_schema_init.js`
4.  Rode o script:
    ```bash
    npm install pocketbase --save # Garanta que o SDK está instalado
    node scripts/pb_schema_init.js
    ```
5.  Se aparecer "✅ Coleção CRIADA", o banco está pronto!

---

## 5. Deploy do Frontend (React)

```bash
# Criar diretório
mkdir -p /var/www/katalogo
cd /var/www/katalogo

# Clone seu repositório (Substitua pela sua URL)
# git clone https://github.com/figueredofxx/katalogo.digital.git .
# OU, se estiver subindo arquivos manualmente via SFTP, coloque-os aqui.

# Instalar dependências
npm install

# Buildar para Produção
npm run build
```

## 6. Configurar Nginx (Proxy Reverso)

O Nginx vai servir o Frontend na porta 80 e redirecionar chamadas `/api` para o PocketBase.

`nano /etc/nginx/sites-available/katalogo`

Cole o conteúdo:

```nginx
server {
    listen 80;
    server_name katalogo.digital *.katalogo.digital; # Substitua pelo seu domínio

    client_max_body_size 10M;

    # Frontend (React Build)
    location / {
        root /var/www/katalogo/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend (PocketBase API)
    location /api/ {
        proxy_pass http://127.0.0.1:8090/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # PocketBase Admin Panel
    location /_/ {
        proxy_pass http://127.0.0.1:8090/_/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar site:
```bash
ln -s /etc/nginx/sites-available/katalogo /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

## 7. Configuração Cloudflare (SSL)

1.  Aponte o DNS (Tipo A) do seu domínio para o IP do servidor.
2.  No painel do Cloudflare, vá em **SSL/TLS**.
3.  Defina o modo como **Flexible** (se o Nginx não tiver SSL configurado) ou **Full** (recomendado, mas exige certificado auto-assinado no servidor).
    *   *Para este guia simples (apenas porta 80 no Nginx), use o modo **Flexible** ou **Full** (se configurar SSL no Nginx).*
    *   **Recomendação:** Use modo **Flexible** inicialmente para garantir que funcione sem erros de certificado 525/526.

## 8. Finalização

Seu sistema deve estar acessível em:
*   Frontend: `http://katalogo.digital`
*   Admin Backend: `http://katalogo.digital/_/`
*   API: `http://katalogo.digital/api/`
