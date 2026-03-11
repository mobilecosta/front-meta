/**
 * Cliente Supabase para operações genéricas de CRUD
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

/**
 * Inicializar cliente Supabase
 */
export function initSupabase(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL e SUPABASE_KEY são obrigatórios');
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}

/**
 * Obter cliente Supabase
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

/**
 * Interface para resposta paginada
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Interface para opções de consulta
 */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

/**
 * Listar registros com paginação e filtros
 */
export async function listRecords<T = any>(
  tableName: string,
  options: QueryOptions = {}
): Promise<PaginatedResponse<T>> {
  const supabase = getSupabase();
  const page = options.page || 1;
  const pageSize = options.pageSize || 10;
  const offset = (page - 1) * pageSize;

  try {
    let query = supabase.from(tableName).select('*', { count: 'exact' });

    // Aplicar filtros
    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      }
    }

    // Aplicar busca por texto (busca em campos string)
    if (options.search) {
      query = query.or(
        `nome.ilike.%${options.search}%,email.ilike.%${options.search}%,descricao.ilike.%${options.search}%`
      );
    }

    // Aplicar ordenação
    if (options.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' });
    }

    // Aplicar paginação
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: data as T[],
      total,
      page,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error(`Erro ao listar registros de ${tableName}:`, error);
    throw error;
  }
}

/**
 * Obter um registro pelo ID
 */
export async function getRecord<T = any>(
  tableName: string,
  id: string
): Promise<T | null> {
  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Registro não encontrado
        return null;
      }
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error(`Erro ao obter registro de ${tableName}:`, error);
    throw error;
  }
}

/**
 * Criar um novo registro
 */
export async function createRecord<T = any>(
  tableName: string,
  data: Record<string, any>
): Promise<T> {
  const supabase = getSupabase();

  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([data])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result as T;
  } catch (error) {
    console.error(`Erro ao criar registro em ${tableName}:`, error);
    throw error;
  }
}

/**
 * Atualizar um registro
 */
export async function updateRecord<T = any>(
  tableName: string,
  id: string,
  data: Record<string, any>
): Promise<T> {
  const supabase = getSupabase();

  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result as T;
  } catch (error) {
    console.error(`Erro ao atualizar registro em ${tableName}:`, error);
    throw error;
  }
}

/**
 * Deletar um registro
 */
export async function deleteRecord(
  tableName: string,
  id: string
): Promise<void> {
  const supabase = getSupabase();

  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Erro ao deletar registro de ${tableName}:`, error);
    throw error;
  }
}

/**
 * Verificar se tabela existe
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const supabase = getSupabase();

  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      return true; // Tabela existe mas está vazia
    }

    return !error;
  } catch (error) {
    return false;
  }
}
