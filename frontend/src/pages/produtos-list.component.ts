/**
 * Página de listagem de Produtos
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PoModule, PoNotificationService } from '@po-ui/ng-components';
import { DynamicTableComponent, TableAction } from '../components/dynamic-table.component';
import { EntityService } from '../services/entity.service';
import { Entity, EntityMetadata, PaginatedResponse, QueryOptions, Produto } from '../models/entity.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CommonModule, PoModule, DynamicTableComponent],
  template: `
    <div class="page-container">
      <po-page-default p-title="Produtos">
        <po-container>
          <po-button
            p-label="Novo Produto"
            p-kind="primary"
            p-icon="po-icon-plus"
            (p-click)="onNewRecord()"
          ></po-button>
        </po-container>

        <app-dynamic-table
          [metadata]="metadata"
          [items]="items"
          [isLoading]="isLoading"
          [totalRecords]="totalRecords"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          [actions]="tableActions"
          (loadData)="onLoadData($event)"
        ></app-dynamic-table>
      </po-page-default>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 20px;
      }
    `,
  ],
})
export class ProdutosListComponent implements OnInit, OnDestroy {
  metadata: EntityMetadata | null = null;
  items: Entity[] = [];
  isLoading = false;
  totalRecords = 0;
  currentPage = 1;
  pageSize = 10;
  tableActions: TableAction[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private entityService: EntityService,
    private notification: PoNotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMetadata();
    this.setupTableActions();
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMetadata() {
    this.entityService
      .getEntityMetadata('produtos')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.metadata = response.data;
          }
        },
        error: (error) => {
          this.notification.error('Erro ao carregar metadados de Produtos');
          console.error(error);
        },
      });
  }

  private setupTableActions() {
    this.tableActions = [
      {
        label: 'Editar',
        action: (row: Entity) => this.onEditRecord(row),
      },
      {
        label: 'Deletar',
        action: (row: Entity) => this.onDeleteRecord(row),
      },
    ];
  }

  onLoadData(options: QueryOptions) {
    this.currentPage = options.page || 1;
    this.pageSize = options.pageSize || 10;
    this.loadData(options);
  }

  private loadData(options: QueryOptions = {}) {
    this.isLoading = true;

    this.entityService
      .listProdutos({
        page: this.currentPage,
        pageSize: this.pageSize,
        sortBy: options.sortBy || 'id',
        sortOrder: options.sortOrder || 'asc',
        search: options.search,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const paginated = response.data as PaginatedResponse<Produto>;
            this.items = paginated.data;
            this.totalRecords = paginated.total;
            this.currentPage = paginated.page;
            this.pageSize = paginated.pageSize;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.notification.error('Erro ao carregar Produtos');
          console.error(error);
          this.isLoading = false;
        },
      });
  }

  onNewRecord() {
    this.router.navigate(['/produtos/novo']);
  }

  onEditRecord(row: Entity) {
    const produto = row as Produto;
    this.router.navigate(['/produtos', produto.id, 'editar']);
  }

  onDeleteRecord(row: Entity) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      const produto = row as Produto;
      this.entityService
        .deleteProduto(produto.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notification.success('Produto deletado com sucesso');
              this.loadData();
            }
          },
          error: (error) => {
            this.notification.error('Erro ao deletar produto');
            console.error(error);
          },
        });
    }
  }
}
