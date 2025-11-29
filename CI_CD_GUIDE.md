# Fluxo de Trabalho Seguro & Deploy (CI/CD Manual)

Este documento define como trabalhamos no **Katalogo** para garantir que o sistema em produção nunca quebre e que as atualizações sejam imperceptíveis para o usuário.

## 1. Regras de Desenvolvimento (Git Flow)

Nunca trabalhe diretamente na branch `main` (produção).

### Passo a Passo:
1.  **Crie uma branch para sua tarefa:**
    ```bash
    git checkout -b feature/nova-funcionalidade
    # ou
    git checkout -b fix/correcao-erro
    ```
2.  **Desenvolva e Teste Localmente:**
    Certifique-se de que `npm run dev` roda sem erros.
3.  **Commit e Push:**
    ```bash
    git add .
    git commit -m "Descrição clara do que foi feito"
    git push origin feature/nova-funcionalidade
    ```
4.  **Merge para Main (Apenas quando estável):**
    Vá para o GitHub, crie um Pull Request (PR) e faça o merge para a `main` somente após revisar.

---

## 2. Como Fazer o Deploy em Produção

Após o código estar aprovado na branch `main` do GitHub, siga estes passos para atualizar o servidor.

### Acesso ao Servidor
Acesse seu terminal SSH:
```bash
ssh root@seu-ip-do-servidor
```

### Executar Atualização Segura
Navegue até a pasta e rode o script de deploy:

```bash
cd /var/www/html
./deploy.sh
```

### O que o script faz?
1.  **Pull:** Baixa o código novo da `main`.
2.  **Install:** Instala novas dependências (se houver).
3.  **Build Isolado:** Cria o site em uma pasta `build_temp`. Se o build falhar (erro de código), o script para e **não quebra o site atual**.
4.  **Atomic Swap:** Se o build for sucesso, ele troca a pasta `build` antiga pela nova em milissegundos.
5.  **Backup:** A versão antiga fica salva em `build_old` caso precise reverter.

---

## 3. Rollback de Emergência

Se você subiu uma atualização e ela contém um bug crítico, você pode voltar para a versão anterior instantaneamente:

**No Servidor:**
```bash
cd /var/www/html
mv build build_broken
mv build_old build
```
*O site volta para a versão anterior imediatamente.*

---

## 4. Segurança do Banco de Dados

*   **Nunca** altere a estrutura do banco de produção (criar tabelas/colunas) sem antes testar localmente.
*   Se o código novo depende de uma coluna nova, rode o comando SQL no Supabase **ANTES** de rodar o `./deploy.sh`.
