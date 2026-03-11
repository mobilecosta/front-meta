/**
 * Página de formulário para criar/editar Produtos
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModule, PoNotificationService } from '@po-ui/ng-components';
import { DynamicFormComponent } from '../components/dynamic-form.component';
import { EntityService } from '../services/entity.service';
import { Entity, EntityMetadata, Produto } from '../models/entity.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-produtos-form',
  standalone: true,
  imports: [CommonModule, PoModule, DynamicFormComponent],
  template: `
    <div class="form-page-container">
      <app-dynamic-form
        [metadata]="metadata"
        [data]="produtoData"
        [isEdit]="isEdit"
        [isSubmitting]="isSubmitting"
        (submit)="onFormSubmit($event)"
        (cancel)="onFormCancel()"
      ></app-dynamic-form>
    </div>
  `,
  styles: [
    `
      .form-page-container {
        padding: 20px;
      }
    `,
  ],
})
export class ProdutosFormComponent implements OnInit, OnDestroy {
  metadata: EntityMetadata | null = null;
  produtoData: Produto | null = null;
  isEdit = false;
  isSubmitting = false;
  produtoId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private entityService: EntityService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: PoNotificationService
  ) {}

  ngOnInit() {
    this.loadMetadata();
    this.checkIfEdit();
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
          this.notification.error('Erro ao carregar metadados');
          console.error(error);
        },
      });
  }

  private checkIfEdit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe({
      next: (params) => {
        if (params['id']) {
          this.isEdit = true;
          this.produtoId = params['id'];
          this.loadProduto(params['id']);
        }
      },
    });
  }

  private loadProduto(id: string) {
    this.entityService
      .getProduto(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.produtoData = response.data;
          }
        },
        error: (error) => {
          this.notification.error('Erro ao carregar produto');
          console.error(error);
          this.router.navigate(['/produtos']);
        },
      });
  }

  onFormSubmit(formData: any) {
    this.isSubmitting = true;

    if (this.isEdit && this.produtoId) {
      // Atualizar
      this.entityService
        .updateProduto(this.produtoId, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notification.success('Produto atualizado com sucesso');
              this.router.navigate(['/produtos']);
            } else {
              this.notification.error(response.error || 'Erro ao atualizar produto');
            }
            this.isSubmitting = false;
          },
          error: (error) => {
            this.notification.error('Erro ao atualizar produto');
            console.error(error);
            this.isSubmitting = false;
          },
        });
    } else {
      // Criar
      this.entityService
        .createProduto(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notification.success('Produto criado com sucesso');
              this.router.navigate(['/produtos']);
            } else {
              this.notification.error(response.error || 'Erro ao criar produto');
            }
            this.isSubmitting = false;
          },
          error: (error) => {
            this.notification.error('Erro ao criar produto');
            console.error(error);
            this.isSubmitting = false;
          },
        });
    }
  }

  onFormCancel() {
    this.router.navigate(['/produtos']);
  }
}
