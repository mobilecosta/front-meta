# Dynamic CRUD PO-UI - Arquitetura do Sistema

## Visão Geral

Sistema full-stack metadata-driven para gerenciamento dinâmico de entidades (Clientes e Produtos) com CRUD genérico, formulários e tabelas dinâmicas baseadas em metadados.

### Stack Tecnológico

**Backend:**
- Express.js com TypeScript
- Supabase (PostgreSQL)
- API REST genérica baseada em metadados
- CORS habilitado

**Frontend:**
- Angular 21 (Standalone Components)
- PO-UI (componentes visuais)
- RxJS (reatividade)
- TypeScript

## Arquitetura Backend

### Sistema de Metadados (`server/metadata.ts`)

Define a estrutura de cada entidade de forma declarativa:

```typescript
interface FieldMetadata {
  name: string;
  label: string;
  type: FieldType; // 'string' | 'number' | 'email' | 'phone' | 'date' | 'datetime' | 'text' | 'select' | 'boolean'
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

interface EntityMetadata {
  name: string;
  tableName: string;
  label: string;
  pluralLabel: string;
  description?: string;
  fields: FieldMetadata[];
  primaryKey?: string;
}
```

### Entidades Definidas

#### Clientes
- `id` (UUID, PK)
- `nome` (string, obrigatório, 3-255 caracteres)
- `email` (email, obrigatório, único)
- `telefone` (phone, opcional)
- `endereco` (text, opcional)
- `data_cadastro` (datetime, automático)

#### Produtos
- `id` (UUID, PK)
- `nome` (string, obrigatório, 3-255 caracteres)
- `descricao` (text, opcional)
- `preco` (number, obrigatório, >= 0)
- `categoria` (select: eletronicos, roupas, alimentos, livros, outros)
- `estoque` (number, obrigatório, >= 0)
- `data_criacao` (datetime, automático)

### Cliente Supabase (`server/supabase-client.ts`)

Funções genéricas para operações CRUD:

```typescript
// Listar com paginação e filtros
listRecords<T>(tableName: string, options: QueryOptions): Promise<PaginatedResponse<T>>

// Obter um registro
getRecord<T>(tableName: string, id: string): Promise<T | null>

// Criar
createRecord<T>(tableName: string, data: Record<string, any>): Promise<T>

// Atualizar
updateRecord<T>(tableName: string, id: string, data: Record<string, any>): Promise<T>

// Deletar
deleteRecord(tableName: string, id: string): Promise<void>
```

### Rotas Express (`server/entity-routes.ts`)

API REST genérica:

```
GET    /api/entities                      - Listar todas as entidades com metadados
GET    /api/entities/:entityName/metadata - Obter metadados de uma entidade
GET    /api/entities/:entityName          - Listar registros (com paginação, busca, filtro)
GET    /api/entities/:entityName/:id      - Obter um registro
POST   /api/entities/:entityName          - Criar registro
PUT    /api/entities/:entityName/:id      - Atualizar registro
DELETE /api/entities/:entityName/:id      - Deletar registro
```

### Validação

Sistema de validação baseado em metadados:

```typescript
validateEntityData(entityName: string, data: Record<string, any>, isUpdate?: boolean)
  -> { valid: boolean; errors: Record<string, string> }
```

Validações suportadas:
- Obrigatoriedade
- Comprimento mínimo/máximo (strings)
- Valor mínimo/máximo (números)
- Formato de email
- Formato de telefone
- Padrão regex customizado

## Arquitetura Frontend

### Estrutura de Pastas

```
frontend/src/
├── app/
│   ├── app.component.ts      - Componente raiz
│   └── app.routes.ts         - Configuração de roteamento
├── components/
│   ├── dynamic-table.component.ts   - Tabela dinâmica
│   └── dynamic-form.component.ts    - Formulário dinâmico
├── pages/
│   ├── clientes-list.component.ts   - Listagem de Clientes
│   └── produtos-list.component.ts   - Listagem de Produtos
├── services/
│   └── entity.service.ts     - Serviço HTTP genérico
├── models/
│   └── entity.model.ts       - Tipos e interfaces
├── styles/
│   └── global.css            - Estilos globais
└── main.ts                   - Bootstrap da aplicação
```

### Serviço HTTP (`frontend/src/services/entity.service.ts`)

Serviço genérico para comunicação com backend:

```typescript
// Métodos genéricos
listRecords<T>(entityName: string, options: QueryOptions): Observable<ApiResponse<PaginatedResponse<T>>>
getRecord<T>(entityName: string, id: string): Observable<ApiResponse<T>>
createRecord<T>(entityName: string, data: Partial<T>): Observable<ApiResponse<T>>
updateRecord<T>(entityName: string, id: string, data: Partial<T>): Observable<ApiResponse<T>>
deleteRecord(entityName: string, id: string): Observable<ApiResponse<void>>

// Métodos específicos para Clientes
listClientes(options: QueryOptions): Observable<ApiResponse<PaginatedResponse<Cliente>>>
getCliente(id: string): Observable<ApiResponse<Cliente>>
createCliente(data: Partial<Cliente>): Observable<ApiResponse<Cliente>>
updateCliente(id: string, data: Partial<Cliente>): Observable<ApiResponse<Cliente>>
deleteCliente(id: string): Observable<ApiResponse<void>>

// Métodos específicos para Produtos
listProdutos(options: QueryOptions): Observable<ApiResponse<PaginatedResponse<Produto>>>
getProduto(id: string): Observable<ApiResponse<Produto>>
createProduto(data: Partial<Produto>): Observable<ApiResponse<Produto>>
updateProduto(id: string, data: Partial<Produto>): Observable<ApiResponse<Produto>>
deleteProduto(id: string): Observable<ApiResponse<void>>
```

### Componentes Dinâmicos

#### DynamicTableComponent
Renderiza tabelas baseadas em metadados:
- Colunas geradas dinamicamente a partir de metadados
- Paginação
- Busca/filtro
- Ordenação
- Ações customizáveis (editar, deletar, etc.)

#### DynamicFormComponent
Renderiza formulários baseados em metadados:
- Campos renderizados dinamicamente
- Validação baseada em metadados
- Suporte para diferentes tipos de campos (input, email, phone, number, date, datetime, textarea, select, checkbox)
- Campos readonly para dados não editáveis
- Botões de ação (Salvar, Cancelar)

### Páginas

#### ClientesListComponent
- Listagem de clientes com tabela dinâmica
- Busca e paginação
- Ações: editar, deletar
- Botão para criar novo cliente

#### ProdutosListComponent
- Listagem de produtos com tabela dinâmica
- Busca e paginação
- Ações: editar, deletar
- Botão para criar novo produto

## Estética Editorial Sofisticada

### Paleta de Cores

- **Fundo**: Creme minimalista (#faf8f3)
- **Texto principal**: Preto/escuro (#1a1a1a)
- **Acentos**: Marrom quente (#8b7355)
- **Cinzas**: Gradação para estrutura (#e8e6e1, #c4c0b8, #6b6b6b)

### Tipografia

- **Títulos (H1-H3)**: Playfair Display (Serif Didone bold)
- **Subtítulos e corpo**: Lora (Serif leve)
- **Detalhes estruturais**: Inter (Sans-serif pequeno e espaçado)

### Características Visuais

- Espaço negativo generoso
- Equilíbrio assimétrico
- Linhas geométricas finas como elementos decorativos
- Sombras sutis para profundidade
- Transições suaves
- Atmosfera intelectual e atemporal

## Fluxo de Dados

### Criar Registro

1. Usuário clica em "Novo [Entidade]"
2. Formulário dinâmico é renderizado com metadados
3. Usuário preenche os campos
4. Validação é aplicada baseada em metadados
5. Ao submeter, dados são enviados via POST /api/entities/:entityName
6. Backend valida novamente e insere no Supabase
7. Resposta é retornada ao frontend
8. Tabela é atualizada

### Listar Registros

1. Componente carrega metadados via GET /api/entities/:entityName/metadata
2. Tabela dinâmica é renderizada com colunas baseadas em metadados
3. Dados são carregados via GET /api/entities/:entityName?page=1&pageSize=10
4. Tabela exibe registros com paginação
5. Usuário pode buscar, filtrar e ordenar

### Editar Registro

1. Usuário clica em "Editar" na tabela
2. Registro é carregado via GET /api/entities/:entityName/:id
3. Formulário dinâmico é renderizado com dados preenchidos
4. Usuário modifica os dados
5. Ao submeter, dados são enviados via PUT /api/entities/:entityName/:id
6. Backend valida e atualiza no Supabase
7. Tabela é atualizada

### Deletar Registro

1. Usuário clica em "Deletar" na tabela
2. Confirmação é solicitada
3. DELETE /api/entities/:entityName/:id é chamado
4. Backend deleta do Supabase
5. Tabela é atualizada

## Configuração Inicial

### Backend

1. Instalar dependências:
   ```bash
   pnpm install
   ```

2. Configurar variáveis de ambiente:
   ```bash
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-api
   ```

3. Executar script SQL no Supabase:
   - Copiar conteúdo de `server/init-supabase.sql`
   - Executar no SQL Editor do Supabase

4. Iniciar servidor:
   ```bash
   pnpm dev
   ```

### Frontend

O frontend Angular é servido pelo Express em produção. Em desenvolvimento, usa Vite com HMR.

## Extensibilidade

### Adicionar Nova Entidade

1. Adicionar metadados em `server/metadata.ts`:
   ```typescript
   export const novaEntidadeMetadata: EntityMetadata = {
     name: 'nova_entidade',
     tableName: 'nova_entidade',
     label: 'Nova Entidade',
     pluralLabel: 'Novas Entidades',
     fields: [
       // ... definir campos
     ],
   };
   ```

2. Registrar em `entitiesMetadata`:
   ```typescript
   export const entitiesMetadata: Record<string, EntityMetadata> = {
     clientes: clientesMetadata,
     produtos: produtosMetadata,
     nova_entidade: novaEntidadeMetadata,
   };
   ```

3. Criar tabela no Supabase com os campos correspondentes

4. Criar página de listagem em `frontend/src/pages/nova-entidade-list.component.ts`

5. Adicionar rota em `frontend/src/app/app.routes.ts`

6. Adicionar menu em `frontend/src/app/app.component.ts`

A API REST genérica funcionará automaticamente para a nova entidade!

## Testes

Executar testes:
```bash
pnpm test
```

Testes incluem:
- Validação de metadados
- Validação de dados de Clientes
- Validação de dados de Produtos
- Testes de autenticação (existentes)

## Deployment

O projeto está configurado para deployment automático via Manus. Certifique-se de:

1. Configurar variáveis de ambiente no painel Manus
2. Executar script SQL no Supabase
3. Clicar em "Publish" no painel Manus

O backend Express e frontend Angular serão automaticamente compilados e deployados.
