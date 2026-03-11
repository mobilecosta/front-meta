/**
 * Sistema de Metadados para Entidades Dinâmicas
 * Define a estrutura, tipos, validações e labels para cada entidade
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

export interface ValidationRule {
  field: string;
  type: 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'phone';
  message: string;
}

/**
 * Metadados para a entidade Clientes
 */
export const clientesMetadata: EntityMetadata = {
  name: 'clientes',
  tableName: 'clientes',
  label: 'Cliente',
  pluralLabel: 'Clientes',
  description: 'Gerenciamento de clientes',
  primaryKey: 'id',
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'string',
      visible: true,
      editable: false,
      sortable: true,
      filterable: false,
    },
    {
      name: 'nome',
      label: 'Nome',
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 255,
      placeholder: 'Digite o nome do cliente',
      visible: true,
      editable: true,
      sortable: true,
      filterable: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      maxLength: 255,
      placeholder: 'Digite o email',
      visible: true,
      editable: true,
      sortable: true,
      filterable: true,
    },
    {
      name: 'telefone',
      label: 'Telefone',
      type: 'phone',
      required: false,
      maxLength: 20,
      placeholder: '(XX) XXXXX-XXXX',
      visible: true,
      editable: true,
      sortable: false,
      filterable: true,
    },
    {
      name: 'endereco',
      label: 'Endereço',
      type: 'text',
      required: false,
      maxLength: 500,
      placeholder: 'Digite o endereço completo',
      visible: true,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      name: 'data_cadastro',
      label: 'Data de Cadastro',
      type: 'datetime',
      required: false,
      visible: true,
      editable: false,
      sortable: true,
      filterable: false,
    },
  ],
};

/**
 * Metadados para a entidade Produtos
 */
export const produtosMetadata: EntityMetadata = {
  name: 'produtos',
  tableName: 'produtos',
  label: 'Produto',
  pluralLabel: 'Produtos',
  description: 'Gerenciamento de produtos',
  primaryKey: 'id',
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'string',
      visible: true,
      editable: false,
      sortable: true,
      filterable: false,
    },
    {
      name: 'nome',
      label: 'Nome',
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 255,
      placeholder: 'Digite o nome do produto',
      visible: true,
      editable: true,
      sortable: true,
      filterable: true,
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'text',
      required: false,
      maxLength: 1000,
      placeholder: 'Digite a descrição do produto',
      visible: true,
      editable: true,
      sortable: false,
      filterable: false,
    },
    {
      name: 'preco',
      label: 'Preço',
      type: 'number',
      required: true,
      min: 0,
      placeholder: '0.00',
      visible: true,
      editable: true,
      sortable: true,
      filterable: false,
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'select',
      required: true,
      options: [
        { value: 'eletronicos', label: 'Eletrônicos' },
        { value: 'roupas', label: 'Roupas' },
        { value: 'alimentos', label: 'Alimentos' },
        { value: 'livros', label: 'Livros' },
        { value: 'outros', label: 'Outros' },
      ],
      visible: true,
      editable: true,
      sortable: true,
      filterable: true,
    },
    {
      name: 'estoque',
      label: 'Estoque',
      type: 'number',
      required: true,
      min: 0,
      placeholder: '0',
      visible: true,
      editable: true,
      sortable: true,
      filterable: false,
    },
    {
      name: 'data_criacao',
      label: 'Data de Criação',
      type: 'datetime',
      required: false,
      visible: true,
      editable: false,
      sortable: true,
      filterable: false,
    },
  ],
};

/**
 * Registro de todas as entidades disponíveis
 */
export const entitiesMetadata: Record<string, EntityMetadata> = {
  clientes: clientesMetadata,
  produtos: produtosMetadata,
};

/**
 * Obter metadados de uma entidade específica
 */
export function getEntityMetadata(entityName: string): EntityMetadata | null {
  return entitiesMetadata[entityName.toLowerCase()] || null;
}

/**
 * Obter lista de todas as entidades disponíveis
 */
export function getAllEntitiesMetadata(): EntityMetadata[] {
  return Object.values(entitiesMetadata);
}

/**
 * Validar dados contra os metadados da entidade
 */
export function validateEntityData(
  entityName: string,
  data: Record<string, any>,
  isUpdate: boolean = false
): { valid: boolean; errors: Record<string, string> } {
  const metadata = getEntityMetadata(entityName);
  if (!metadata) {
    return { valid: false, errors: { entity: 'Entidade não encontrada' } };
  }

  const errors: Record<string, string> = {};

  for (const field of metadata.fields) {
    const value = data[field.name];

    // Validação de campo obrigatório (exceto em updates para campos que podem ser undefined)
    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.name] = `${field.label} é obrigatório`;
      continue;
    }

    // Se o valor está vazio e não é obrigatório, pular validações adicionais
    if (value === undefined || value === null || value === '') {
      continue;
    }

    // Validações específicas por tipo
    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = `${field.label} deve ser um email válido`;
        }
        break;

      case 'phone':
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
          errors[field.name] = `${field.label} deve ser um telefone válido`;
        }
        break;

      case 'string':
      case 'text':
        if (typeof value !== 'string') {
          errors[field.name] = `${field.label} deve ser um texto`;
          break;
        }
        if (field.minLength && value.length < field.minLength) {
          errors[field.name] = `${field.label} deve ter no mínimo ${field.minLength} caracteres`;
        }
        if (field.maxLength && value.length > field.maxLength) {
          errors[field.name] = `${field.label} deve ter no máximo ${field.maxLength} caracteres`;
        }
        break;

      case 'number':
        if (typeof value !== 'number' && isNaN(Number(value))) {
          errors[field.name] = `${field.label} deve ser um número`;
          break;
        }
        const numValue = typeof value === 'number' ? value : Number(value);
        if (field.min !== undefined && numValue < field.min) {
          errors[field.name] = `${field.label} deve ser no mínimo ${field.min}`;
        }
        if (field.max !== undefined && numValue > field.max) {
          errors[field.name] = `${field.label} deve ser no máximo ${field.max}`;
        }
        break;

      case 'date':
      case 'datetime':
        if (isNaN(Date.parse(value))) {
          errors[field.name] = `${field.label} deve ser uma data válida`;
        }
        break;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
