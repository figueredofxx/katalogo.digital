
# Guia de Deploy - Katalogo (Ubuntu 20.04 + Nginx)

Este guia descreve como colocar o Katalogo em produção em um servidor "limpo" (VPS/Droplet).

## Pré-requisitos
*   Servidor Ubuntu 20.04 acesso root.
*   Domínio apontado para o IP do servidor (Tipo A).
    *   `katalogo.digital` -> IP do Servidor
    *   `*.katalogo.digital` -> IP do Servidor (Wildcard para lojas)

## Passo 1: Preparar o Servidor

Acesse via SSH e atualize os pacotes:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl git nginx -y
```

Instale o Node.js (Versão 18 ou superior):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

## Passo 2: Baixar e Construir o Código

Clone seu repositório (substitua pela URL do seu git):
```bash
cd /var/www
sudo git clone https://github.com/seu-usuario/katalogo.git html
cd html
```

Instale as dependências e crie o build:
```bash
# Crie o arquivo .env de produção
nano .env
# Cole:
# REACT_APP_SUPABASE_URL=sua_url_supabase
# REACT_APP_SUPABASE_ANON_KEY=sua_key_supabase

# Instalar e Buildar
sudo npm install
sudo npm run build
```

## Passo 3: Configurar Nginx (Single Page App)

Remova a config padrão e crie a do Katalogo:
```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nano /etc/nginx/sites-available/katalogo
```

Cole a configuração abaixo (Substitua `katalogo.digital` pelo seu domínio):

```nginx
server {
    listen 80;
    server_name katalogo.digital *.katalogo.digital;
    
    root /var/www/html/build;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache de arquivos estáticos
    location /static/ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

Ative o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/katalogo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Passo 4: Configurar SSL (HTTPS)

Instale o Certbot:
```bash
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

Gere o certificado (incluindo o wildcard se seu DNS suportar, ou apenas o domínio principal):
```bash
sudo certbot --nginx -d katalogo.digital
```

## Passo 5: Atualizações Futuras

Para atualizar o sistema futuramente:
1.  `cd /var/www/html`
2.  `git pull`
3.  `npm run build`

