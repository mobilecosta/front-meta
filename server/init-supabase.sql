-- Script de inicialização do Supabase para o sistema Dynamic CRUD PO-UI
-- Execute este script no SQL Editor do Supabase para criar as tabelas

-- Criar tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  endereco TEXT,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL CHECK (preco >= 0),
  categoria VARCHAR(50) NOT NULL,
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos(nome);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);

-- Habilitar Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;

-- Criar políticas de acesso público (para desenvolvimento)
-- AVISO: Em produção, implemente políticas de segurança apropriadas

-- Política para Clientes
CREATE POLICY "clientes_public_read" ON clientes
  FOR SELECT USING (true);

CREATE POLICY "clientes_public_insert" ON clientes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "clientes_public_update" ON clientes
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "clientes_public_delete" ON clientes
  FOR DELETE USING (true);

-- Política para Produtos
CREATE POLICY "produtos_public_read" ON produtos
  FOR SELECT USING (true);

CREATE POLICY "produtos_public_insert" ON produtos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "produtos_public_update" ON produtos
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "produtos_public_delete" ON produtos
  FOR DELETE USING (true);

-- Inserir dados de exemplo (opcional)
-- INSERT INTO clientes (nome, email, telefone, endereco) VALUES
-- ('João Silva', 'joao@example.com', '(11) 98765-4321', 'Rua A, 123'),
-- ('Maria Santos', 'maria@example.com', '(11) 98765-4322', 'Rua B, 456');

-- INSERT INTO produtos (nome, descricao, preco, categoria, estoque) VALUES
-- ('Notebook', 'Notebook de alta performance', 3500.00, 'eletronicos', 10),
-- ('Mouse', 'Mouse sem fio', 50.00, 'eletronicos', 50);
