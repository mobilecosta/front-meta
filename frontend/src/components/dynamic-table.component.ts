/**
 * Componente dinâmico de tabela PO-UI
 * Renderiza tabelas baseadas em metadados
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule, PoPaginatorConfig } from '@po-ui/ng-components';
import { Entity, EntityMetadata, FieldMetadata, PaginatedResponse, QueryOptions } from '../models/entity.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface TableAction {
  label: string;
  icon?: string;
  action: (row: Entity) => void;
  visible?: (row: Entity) => boolean;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, PoModule],
  template: `
    <div class="table-container">
      <po-page-default [p-title]="metadata?.pluralLabel || 'Registros'">
        <!-- Search and Filter Bar -->
        <po-container>
          <po-page-default-detail>
            <po-field-container>
              <po-input
                p-label="Buscar"
                p-placeholder="Digite para buscar..."
                [(ngModel)]="searchTerm"
                (p-change)="onSearch()"
              ></po-input>
            </po-field-container>
          </po-page-default-detail>
        </po-container>

        <!-- Table -->
        <po-table
          [p-columns]="tableColumns"
          [p-items]="items"
          [p-loading]="isLoading"
          [p-striped]="true"
          [p-sort]="true"
          [p-sort-by]="sortBy"
          [p-sort-type]="sortOrder"
          (p-sort-change)="onSort($event)"
        >
          <!-- Action column -->
          <ng-template poTableRowTemplate let-rowItem>
            <po-table-row [p-item]="rowItem">
              <po-table-cell>
                <div class="actions">
                  <button
                    *ngFor="let action of actions"
                    [hidden]="action.visible && !action.visible(rowItem)"
                    (click)="action.action(rowItem)"
                    class="action-btn"
                    [title]="action.label"
                  >
                    {{ action.label }}
                  </button>
                </div>
              </po-table-cell>
            </po-table-row>
          </ng-template>
        </po-table>

        <!-- Pagination -->
        <po-container *ngIf="paginationConfig">
          <po-paginator
            [p-current]="currentPage"
            [p-items-per-page]="pageSize"
            [p-total]="totalRecords"
            (p-page-change)="onPageChange($event)"
          ></po-paginator>
        </po-container>
      </po-page-default>
    </div>
  `,
  styles: [
    `
      .table-container {
        padding: 20px;
      }

      .actions {
        display: flex;
        gap: 8px;
      }

      .action-btn {
        padding: 4px 12px;
        border: 1px solid #ccc;
        background: #f5f5f5;
        cursor: pointer;
        border-radius: 4px;
        font-size: 12px;
        transition: all 0.2s;
      }

      .action-btn:hover {
        background: #e0e0e0;
        border-color: #999;
      }
    `,
  ],
})
export class DynamicTableComponent implements OnInit, OnDestroy {
  @Input() metadata: EntityMetadata | null = null;
  @Input() items: Entity[] = [];
  @Input() isLoading = false;
  @Input() totalRecords = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() actions: TableAction[] = [];

  @Output() loadData = new EventEmitter<QueryOptions>();
  @Output() actionTriggered = new EventEmitter<{ action: string; item: Entity }>();

  tableColumns: any[] = [];
  searchTerm = '';
  sortBy = 'id';
  sortOrder: 'asc' | 'desc' = 'asc';
  paginationConfig: PoPaginatorConfig | null = null;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.buildTableColumns();
    this.setupPagination();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildTableColumns() {
    if (!this.metadata) return;

    this.tableColumns = this.metadata.fields
      .filter(field => field.visible !== false)
      .map(field => ({
        property: field.name,
        label: field.label,
        type: this.mapFieldTypeToPoType(field.type),
        sortable: field.sortable !== false,
        width: this.getColumnWidth(field.type),
      }));

    // Adicionar coluna de ações
    this.tableColumns.push({
      property: 'actions',
      label: 'Ações',
      type: 'string',
      sortable: false,
      width: '150px',
    });
  }

  private mapFieldTypeToPoType(fieldType: string): string {
    const typeMap: Record<string, string> = {
      string: 'string',
      text: 'string',
      number: 'number',
      email: 'string',
      phone: 'string',
      date: 'date',
      datetime: 'datetime',
      select: 'string',
      boolean: 'boolean',
    };
    return typeMap[fieldType] || 'string';
  }

  private getColumnWidth(fieldType: string): string {
    if (fieldType === 'text') return '300px';
    if (fieldType === 'email') return '200px';
    if (fieldType === 'phone') return '150px';
    if (fieldType === 'date' || fieldType === 'datetime') return '150px';
    return 'auto';
  }

  private setupPagination() {
    this.paginationConfig = {
      currentPage: this.currentPage,
      itemsPerPage: this.pageSize,
      totalItems: this.totalRecords,
    };
  }

  onSearch() {
    this.currentPage = 1;
    this.emitLoadData();
  }

  onSort(event: any) {
    this.sortBy = event.property;
    this.sortOrder = event.type === 'ascending' ? 'asc' : 'desc';
    this.currentPage = 1;
    this.emitLoadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.emitLoadData();
  }

  private emitLoadData() {
    this.loadData.emit({
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      search: this.searchTerm,
    });
  }
}
