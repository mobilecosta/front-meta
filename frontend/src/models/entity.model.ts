/**
 * Modelos de dados para as entidades
 */

export type FieldType = 'string' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'text' | 'select' | 'boolean';

export interface FieldMetadata {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  helpText?: string;
  visible?: boolean;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface EntityMetadata {
  name: string;
  tableName: string;
  label: string;
  pluralLabel: string;
  description?: string;
  fields: FieldMetadata[];
  primaryKey?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Modelo para Cliente
 */
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_cadastro?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Modelo para Produto
 */
export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  estoque: number;
  data_criacao?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Union type para qualquer entidade
 */
export type Entity = Cliente | Produto;

/**
 * Opções de consulta
 */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}
