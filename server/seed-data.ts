/**
 * Script para inserir dados de exemplo no Supabase
 * Executar: npx ts-node server/seed-data.ts
 */

import { getSupabase } from './supabase-client';
import { v4 as uuidv4 } from 'uuid';

async function seedData() {
  console.log('[Seed] Iniciando inserção de dados de exemplo...');

  const supabase = getSupabase();

  try {
    // Inserir clientes de exemplo
    console.log('[Seed] Inserindo clientes...');
    const clientes = [
      {
        id: uuidv4(),
        nome: 'João Silva',
        email: 'joao.silva@example.com',
        telefone: '(11) 98765-4321',
        endereco: 'Rua das Flores, 123 - São Paulo, SP',
        data_cadastro: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Maria Santos',
        email: 'maria.santos@example.com',
        telefone: '(21) 99876-5432',
        endereco: 'Avenida Paulista, 456 - São Paulo, SP',
        data_cadastro: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@example.com',
        telefone: '(31) 98765-4321',
        endereco: 'Rua Minas Gerais, 789 - Belo Horizonte, MG',
        data_cadastro: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Ana Costa',
        email: 'ana.costa@example.com',
        telefone: '(85) 99876-5432',
        endereco: 'Avenida Beira Mar, 321 - Fortaleza, CE',
        data_cadastro: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Pedro Ferreira',
        email: 'pedro.ferreira@example.com',
        telefone: '(47) 98765-4321',
        endereco: 'Rua Santa Catarina, 654 - Blumenau, SC',
        data_cadastro: new Date().toISOString(),
      },
    ];

    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .insert(clientes)
      .select();

    if (clientesError) {
      console.error('[Seed] Erro ao inserir clientes:', clientesError);
    } else {
      console.log(`[Seed] ${clientesData?.length || 0} clientes inseridos com sucesso`);
    }

    // Inserir produtos de exemplo
    console.log('[Seed] Inserindo produtos...');
    const produtos = [
      {
        id: uuidv4(),
        nome: 'Notebook Dell XPS 13',
        descricao: 'Notebook ultraportátil com processador Intel i7, 16GB RAM, 512GB SSD',
        preco: 4500.0,
        categoria: 'eletronicos',
        estoque: 15,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Mouse Logitech MX Master 3',
        descricao: 'Mouse sem fio de alta precisão com múltiplos botões programáveis',
        preco: 350.0,
        categoria: 'eletronicos',
        estoque: 45,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Teclado Mecânico RGB',
        descricao: 'Teclado mecânico com iluminação RGB e switches Cherry MX',
        preco: 450.0,
        categoria: 'eletronicos',
        estoque: 30,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Monitor LG 27 polegadas 4K',
        descricao: 'Monitor IPS 4K com taxa de atualização 60Hz e suporte HDR',
        preco: 1800.0,
        categoria: 'eletronicos',
        estoque: 10,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Webcam Logitech C920',
        descricao: 'Webcam Full HD com áudio estéreo e foco automático',
        preco: 280.0,
        categoria: 'eletronicos',
        estoque: 25,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Headset Corsair Virtuoso',
        descricao: 'Headset sem fio com som surround 7.1 e microfone removível',
        preco: 650.0,
        categoria: 'eletronicos',
        estoque: 20,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Camiseta Básica Preta',
        descricao: 'Camiseta 100% algodão, confortável e durável',
        preco: 49.9,
        categoria: 'roupas',
        estoque: 100,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Calça Jeans Premium',
        descricao: 'Calça jeans de alta qualidade com acabamento premium',
        preco: 129.9,
        categoria: 'roupas',
        estoque: 60,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Livro Clean Code',
        descricao: 'Guia essencial para escrever código limpo e profissional',
        preco: 89.9,
        categoria: 'livros',
        estoque: 35,
        data_criacao: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nome: 'Livro Design Patterns',
        descricao: 'Referência completa sobre padrões de design em software',
        preco: 95.0,
        categoria: 'livros',
        estoque: 28,
        data_criacao: new Date().toISOString(),
      },
    ];

    const { data: produtosData, error: produtosError } = await supabase
      .from('produtos')
      .insert(produtos)
      .select();

    if (produtosError) {
      console.error('[Seed] Erro ao inserir produtos:', produtosError);
    } else {
      console.log(`[Seed] ${produtosData?.length || 0} produtos inseridos com sucesso`);
    }

    console.log('[Seed] Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('[Seed] Erro geral:', error);
    process.exit(1);
  }
}

seedData();
