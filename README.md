# Front-Meta: Sistema CRUD Dinâmico com Angular + PO-UI

Sistema full-stack metadata-driven para gerenciamento dinâmico de entidades com CRUD genérico, formulários e tabelas dinâmicas baseadas em metadados.

## 🎯 Visão Geral

**Front-Meta** é uma arquitetura inovadora que permite criar sistemas de gerenciamento de dados sem necessidade de reescrever código para cada nova entidade. Baseado em **metadados**, o sistema gera automaticamente:

- API REST genérica para operações CRUD
- Tabelas dinâmicas com paginação, busca e filtro
- Formulários dinâmicos com validação
- Roteamento automático
- Componentes reutilizáveis

## 🏗️ Arquitetura

### Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Frontend** | Angular | 21.2.1 |
| **UI Components** | PO-UI | 21.4.0 |
| **Backend** | Express.js | 4.21.2 |
| **Linguagem** | TypeScript | 5.9.3 |
| **Banco de Dados** | Supabase (PostgreSQL) | - |
| **HTTP Client** | Axios | 1.12.0 |
| **State Management** | RxJS | 7.8.2 |

### Estrutura de Pastas

```
front-meta/
├── client/                          # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts     # Componente raiz
│   │   │   └── app.routes.ts        # Roteamento
│   │   ├── components/
│   │   │   ├── dynamic-table.component.ts
│   │   │   └── dynamic-form.component.ts
│   │   ├── pages/
│   │   │   ├── clientes-list.component.ts
│   │   │   ├── clientes-form.component.ts
│   │   │   ├── produtos-list.component.ts
│   │   │   └── produtos-form.component.ts
│   │   ├── services/
│   │   │   └── entity.service.ts    # Serviço HTTP genérico
│   │   ├── models/
│   │   │   └── entity.model.ts      # Tipos TypeScript
│   │   ├── styles/
│   │   │   └── global.css           # Estilos editorial
│   │   └── main.ts
│   └── index.html
├── server/                          # Backend Express
│   ├── metadata.ts                  # Sistema de metadados
│   ├── supabase-client.ts           # Cliente Supabase
│   ├── entity-routes.ts             # Rotas genéricas
│   ├── seed-data.ts                 # Dados de exemplo
│   ├── metadata.test.ts             # Testes
│   └── _core/
│       └── index.ts                 # Servidor Express
├── drizzle/
│   └── schema.ts                    # Schema do banco
├── ARCHITECTURE.md                  # Documentação detalhada
├── package.json
└── README.md
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 22+
- pnpm 10+
- Conta Supabase

### Instalação

```bash
# Clonar repositório
git clone https://github.com/mobilecosta/front-meta.git
cd front-meta

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase
```

### Configuração Supabase

1. Acesse https://app.supabase.com
2. Crie um novo projeto ou use existente
3. Vá para SQL Editor
4. Execute o script em `server/init-supabase.sql`
5. Copie as credenciais para `.env.local`:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-api
```

### Executar Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Em outro terminal, inserir dados de exemplo
pnpm seed

# Executar testes
pnpm test
```

Acesse http://localhost:3000

## 📊 Entidades Disponíveis

### Clientes
- `id` (UUID) - Identificador único
- `nome` (string) - Nome do cliente
- `email` (email) - Email único
- `telefone` (phone) - Telefone
- `endereco` (text) - Endereço
- `data_cadastro` (datetime) - Data de cadastro

### Produtos
- `id` (UUID) - Identificador único
- `nome` (string) - Nome do produto
- `descricao` (text) - Descrição
- `preco` (decimal) - Preço
- `categoria` (select) - Categoria
- `estoque` (number) - Quantidade em estoque
- `data_criacao` (datetime) - Data de criação

## 🔌 API REST

### Endpoints Genéricos

```bash
# Listar com paginação e busca
GET /api/entities/:entityName?page=1&pageSize=10&search=termo

# Obter metadados
GET /api/entities/:entityName/metadata

# Obter um registro
GET /api/entities/:entityName/:id

# Criar
POST /api/entities/:entityName
Content-Type: application/json

# Atualizar
PUT /api/entities/:entityName/:id

# Deletar
DELETE /api/entities/:entityName/:id
```

### Exemplo de Requisição

```bash
# Listar clientes
curl "http://localhost:3000/api/entities/clientes?page=1&pageSize=10"

# Criar cliente
curl -X POST http://localhost:3000/api/entities/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua das Flores, 123"
  }'
```

## 🎨 Estética Editorial

O sistema implementa uma estética sofisticada e minimalista:

- **Paleta de Cores**: Fundo creme (#faf8f3), acentos marrom quente (#8b7355)
- **Tipografia**: 
  - Títulos: Playfair Display (Didone serif bold)
  - Corpo: Lora (serif leve)
  - Detalhes: Inter (sans-serif)
- **Layout**: Espaço negativo generoso, equilíbrio assimétrico
- **Elementos**: Linhas geométricas finas, sombras sutis

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Modo watch
pnpm test --watch

# Com cobertura
pnpm test --coverage
```

**Status**: ✅ 20 testes passando
- 16 testes de metadados
- 3 testes de conexão Supabase
- 1 teste de autenticação

## 📦 Build e Deploy

```bash
# Compilar para produção
pnpm build

# Iniciar em produção
pnpm start
```

## 🔧 Extensibilidade

Para adicionar uma nova entidade, siga estes passos:

### 1. Definir Metadados

Edite `server/metadata.ts`:

```typescript
export const novaEntidadeMetadata: EntityMetadata = {
  name: 'nova_entidade',
  tableName: 'nova_entidade',
  label: 'Nova Entidade',
  pluralLabel: 'Novas Entidades',
  fields: [
    {
      name: 'id',
      label: 'ID',
      type: 'string',
      visible: false,
    },
    {
      name: 'nome',
      label: 'Nome',
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    // ... mais campos
  ],
};
```

### 2. Registrar Metadados

```typescript
export const entitiesMetadata: Record<string, EntityMetadata> = {
  clientes: clientesMetadata,
  produtos: produtosMetadata,
  nova_entidade: novaEntidadeMetadata, // ← Adicionar aqui
};
```

### 3. Criar Tabela no Supabase

```sql
CREATE TABLE nova_entidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  -- ... mais colunas
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Criar Página de Listagem

Copie `frontend/src/pages/clientes-list.component.ts` e adapte para `nova-entidade-list.component.ts`

### 5. Adicionar Rota

Edite `frontend/src/app/app.routes.ts`:

```typescript
{
  path: 'nova-entidade',
  component: NovaEntidadeListComponent,
},
{
  path: 'nova-entidade/novo',
  component: NovaEntidadeFormComponent,
},
{
  path: 'nova-entidade/:id/editar',
  component: NovaEntidadeFormComponent,
},
```

### 6. Adicionar Menu

Edite `frontend/src/app/app.component.ts`:

```typescript
menus = [
  // ... menus existentes
  {
    label: 'Nova Entidade',
    icon: 'po-icon-document',
    link: '/nova-entidade',
  },
];
```

**Pronto!** A API REST genérica funcionará automaticamente para a nova entidade.

## 📚 Documentação

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentação técnica completa
- **[todo.md](./todo.md)** - Status de funcionalidades

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Manus](https://manus.im)

## 🙋 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Versão**: 1.0.0  
**Última atualização**: Março 2026  
**Status**: ✅ Pronto para produção
