/**
 * Serviço genérico para operações CRUD com backend
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Entity,
  EntityMetadata,
  PaginatedResponse,
  ApiResponse,
  QueryOptions,
  Cliente,
  Produto,
} from '../models/entity.model';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private apiUrl = '/api/entities';

  constructor(private http: HttpClient) {}

  /**
   * Obter todas as entidades disponíveis com seus metadados
   */
  getAllEntitiesMetadata(): Observable<ApiResponse<EntityMetadata[]>> {
    return this.http.get<ApiResponse<EntityMetadata[]>>(this.apiUrl);
  }

  /**
   * Obter metadados de uma entidade específica
   */
  getEntityMetadata(entityName: string): Observable<ApiResponse<EntityMetadata>> {
    return this.http.get<ApiResponse<EntityMetadata>>(
      `${this.apiUrl}/${entityName}/metadata`
    );
  }

  /**
   * Listar registros de uma entidade com paginação e filtros
   */
  listRecords<T extends Entity = Entity>(
    entityName: string,
    options: QueryOptions = {}
  ): Observable<ApiResponse<PaginatedResponse<T>>> {
    let params = new HttpParams();

    if (options.page) params = params.set('page', options.page.toString());
    if (options.pageSize) params = params.set('pageSize', options.pageSize.toString());
    if (options.sortBy) params = params.set('sortBy', options.sortBy);
    if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
    if (options.search) params = params.set('search', options.search);

    return this.http.get<ApiResponse<PaginatedResponse<T>>>(
      `${this.apiUrl}/${entityName}`,
      { params }
    );
  }

  /**
   * Obter um registro específico
   */
  getRecord<T extends Entity = Entity>(
    entityName: string,
    id: string
  ): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${entityName}/${id}`);
  }

  /**
   * Criar um novo registro
   */
  createRecord<T extends Entity = Entity>(
    entityName: string,
    data: Partial<T>
  ): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${entityName}`, data);
  }

  /**
   * Atualizar um registro existente
   */
  updateRecord<T extends Entity = Entity>(
    entityName: string,
    id: string,
    data: Partial<T>
  ): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(
      `${this.apiUrl}/${entityName}/${id}`,
      data
    );
  }

  /**
   * Deletar um registro
   */
  deleteRecord(entityName: string, id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${entityName}/${id}`
    );
  }

  /**
   * Métodos específicos para Clientes
   */
  listClientes(options: QueryOptions = {}): Observable<ApiResponse<PaginatedResponse<Cliente>>> {
    return this.listRecords<Cliente>('clientes', options);
  }

  getCliente(id: string): Observable<ApiResponse<Cliente>> {
    return this.getRecord<Cliente>('clientes', id);
  }

  createCliente(data: Partial<Cliente>): Observable<ApiResponse<Cliente>> {
    return this.createRecord<Cliente>('clientes', data);
  }

  updateCliente(id: string, data: Partial<Cliente>): Observable<ApiResponse<Cliente>> {
    return this.updateRecord<Cliente>('clientes', id, data);
  }

  deleteCliente(id: string): Observable<ApiResponse<void>> {
    return this.deleteRecord('clientes', id);
  }

  /**
   * Métodos específicos para Produtos
   */
  listProdutos(options: QueryOptions = {}): Observable<ApiResponse<PaginatedResponse<Produto>>> {
    return this.listRecords<Produto>('produtos', options);
  }

  getProduto(id: string): Observable<ApiResponse<Produto>> {
    return this.getRecord<Produto>('produtos', id);
  }

  createProduto(data: Partial<Produto>): Observable<ApiResponse<Produto>> {
    return this.createRecord<Produto>('produtos', data);
  }

  updateProduto(id: string, data: Partial<Produto>): Observable<ApiResponse<Produto>> {
    return this.updateRecord<Produto>('produtos', id, data);
  }

  deleteProduto(id: string): Observable<ApiResponse<void>> {
    return this.deleteRecord('produtos', id);
  }
}
