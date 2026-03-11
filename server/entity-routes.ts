/**
 * Rotas Express genéricas para operações CRUD de entidades
 * Baseadas em metadados configuráveis
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getEntityMetadata,
  getAllEntitiesMetadata,
  validateEntityData,
} from './metadata';
import {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  QueryOptions,
  PaginatedResponse,
} from './supabase-client';

const router = Router();

/**
 * GET /api/entities
 * Listar todas as entidades disponíveis com seus metadados
 */
router.get('/entities', (req: Request, res: Response) => {
  try {
    const entities = getAllEntitiesMetadata();
    res.json({
      success: true,
      data: entities,
    });
  } catch (error) {
    console.error('Erro ao listar entidades:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar entidades',
    });
  }
});

/**
 * GET /api/entities/:entityName/metadata
 * Obter metadados de uma entidade específica
 */
router.get('/entities/:entityName/metadata', (req: Request, res: Response) => {
  try {
    const { entityName } = req.params;
    const metadata = getEntityMetadata(entityName);

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Entidade não encontrada',
      });
    }

    res.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error('Erro ao obter metadados:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter metadados',
    });
  }
});

/**
 * GET /api/entities/:entityName
 * Listar registros de uma entidade com paginação, busca e filtros
 */
router.get('/entities/:entityName', async (req: Request, res: Response) => {
  try {
    const { entityName } = req.params;
    const metadata = getEntityMetadata(entityName);

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Entidade não encontrada',
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'id';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'asc';
    const search = (req.query.search as string) || '';

    const options: QueryOptions = {
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
    };

    const result = await listRecords(metadata.tableName, options);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erro ao listar registros:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar registros',
    });
  }
});

/**
 * GET /api/entities/:entityName/:id
 * Obter um registro específico
 */
router.get('/entities/:entityName/:id', async (req: Request, res: Response) => {
  try {
    const { entityName, id } = req.params;
    const metadata = getEntityMetadata(entityName);

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Entidade não encontrada',
      });
    }

    const record = await getRecord(metadata.tableName, id);

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Registro não encontrado',
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Erro ao obter registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao obter registro',
    });
  }
});

/**
 * POST /api/entities/:entityName
 * Criar um novo registro
 */
router.post('/entities/:entityName', async (req: Request, res: Response) => {
  try {
    const { entityName } = req.params;
    const metadata = getEntityMetadata(entityName);

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Entidade não encontrada',
      });
    }

    // Validar dados
    const validation = validateEntityData(entityName, req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        errors: validation.errors,
      });
    }

    // Preparar dados para inserção
    const dataToInsert: Record<string, any> = {
      id: uuidv4(),
      ...req.body,
    };

    // Adicionar timestamp de criação se o campo existir
    if (metadata.fields.some(f => f.name === 'data_cadastro')) {
      dataToInsert.data_cadastro = new Date().toISOString();
    }
    if (metadata.fields.some(f => f.name === 'data_criacao')) {
      dataToInsert.data_criacao = new Date().toISOString();
    }

    const record = await createRecord(metadata.tableName, dataToInsert);

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Erro ao criar registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar registro',
    });
  }
});

/**
 * PUT /api/entities/:entityName/:id
 * Atualizar um registro existente
 */
router.put('/entities/:entityName/:id', async (req: Request, res: Response) => {
  try {
    const { entityName, id } = req.params;
    const metadata = getEntityMetadata(entityName);

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Entidade não encontrada',
      });
    }

    // Verificar se registro existe
    const existingRecord = await getRecord(metadata.tableName, id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        error: 'Registro não encontrado',
      });
    }

    // Validar dados (update)
    const validation = validateEntityData(entityName, req.body, true);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        errors: validation.errors,
      });
    }

    // Atualizar registro
    const record = await updateRecord(metadata.tableName, id, req.body);

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('Erro ao atualizar registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar registro',
    });
  }
});

/**
 * DELETE /api/entities/:entityName/:id
 * Deletar um registro
 */
router.delete('/entities/:entityName/:id', async (req: Request, res: Response) => {
  try {
    const { entityName, id } = req.params;
    const metadata = getEntityMetadata(entityName);

    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Entidade não encontrada',
      });
    }

    // Verificar se registro existe
    const existingRecord = await getRecord(metadata.tableName, id);
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        error: 'Registro não encontrado',
      });
    }

    // Deletar registro
    await deleteRecord(metadata.tableName, id);

    res.json({
      success: true,
      message: 'Registro deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar registro',
    });
  }
});

export default router;
