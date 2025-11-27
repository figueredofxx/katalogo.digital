
# Guia de Configuração do Banco de Dados (Supabase)

## 🚨 ATUALIZAÇÃO FINAL (Produção)

Se você já rodou os scripts anteriores, **rode apenas o bloco abaixo** no SQL Editor para finalizar a estrutura e criar seu Super Admin.

```sql
-- 1. Adicionar colunas faltantes para Super Admin e Regra de 15 dias do Slug
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS is_super_admin boolean DEFAULT false;

ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS slug_history jsonb DEFAULT '[]'::jsonb;

-- 2. Script para PROMOVER seu usuário a Super Admin
-- Substitua 'seu@email.com' pelo email que você usou para criar a conta na tela de registro
UPDATE public.tenants
SET is_super_admin = true,
    plan = 'pro',
    subscription_status = 'active'
WHERE email = 'control@katalogo.digital'; -- <--- COLOQUE SEU EMAIL AQUI
```

---

## Script Completo (Apenas para novos bancos zerados)

Se você está começando do zero agora, use o script abaixo:

```sql
create extension if not exists "uuid-ossp";

create table public.tenants (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null unique,
  name text not null,
  description text,
  logo_url text,
  banner_url text,
  primary_color text default '#4B0082',
  whatsapp_number text,
  instagram text,
  address text,
  opening_hours text,
  
  -- Planos e Admin
  plan text default 'basic',
  subscription_status text default 'trial',
  trial_ends_at timestamp with time zone,
  is_super_admin boolean default false, -- Flag de Super Admin
  
  -- Configurações Avançadas
  slug_history jsonb default '[]'::jsonb, -- Histórico de mudanças de slug
  payment_methods_json jsonb default '{"pix": true, "creditCard": true, "money": true}'::jsonb,
  delivery_config jsonb default '{"mode": "fixed", "fixedPrice": 0}'::jsonb,
  credit_card_interest_rate numeric default 0,
  order_control_mode text default 'kanban',
  email text, -- Email do dono para facilitar busca

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tenants enable row level security;

-- Policies
create policy "Public tenants are viewable by everyone" on public.tenants for select using (true);
create policy "Users can update own tenant" on public.tenants for update using (auth.uid() = user_id);
create policy "Users can insert tenant" on public.tenants for insert with check (auth.uid() = user_id);

-- (Adicione aqui as tabelas categories, products, orders, etc conforme scripts anteriores)
-- ...
```
