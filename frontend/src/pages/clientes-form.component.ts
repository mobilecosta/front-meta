/**
 * Página de formulário para criar/editar Clientes
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PoModule, PoNotificationService } from '@po-ui/ng-components';
import { DynamicFormComponent } from '../components/dynamic-form.component';
import { EntityService } from '../services/entity.service';
import { Entity, EntityMetadata, Cliente } from '../models/entity.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-clientes-form',
  standalone: true,
  imports: [CommonModule, PoModule, DynamicFormComponent],
  template: `
    <div class="form-page-container">
      <app-dynamic-form
        [metadata]="metadata"
        [data]="clienteData"
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
export class ClientesFormComponent implements OnInit, OnDestroy {
  metadata: EntityMetadata | null = null;
  clienteData: Cliente | null = null;
  isEdit = false;
  isSubmitting = false;
  clienteId: string | null = null;

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
      .getEntityMetadata('clientes')
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
          this.clienteId = params['id'];
          this.loadCliente(params['id']);
        }
      },
    });
  }

  private loadCliente(id: string) {
    this.entityService
      .getCliente(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.clienteData = response.data;
          }
        },
        error: (error) => {
          this.notification.error('Erro ao carregar cliente');
          console.error(error);
          this.router.navigate(['/clientes']);
        },
      });
  }

  onFormSubmit(formData: any) {
    this.isSubmitting = true;

    if (this.isEdit && this.clienteId) {
      // Atualizar
      this.entityService
        .updateCliente(this.clienteId, formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notification.success('Cliente atualizado com sucesso');
              this.router.navigate(['/clientes']);
            } else {
              this.notification.error(response.error || 'Erro ao atualizar cliente');
            }
            this.isSubmitting = false;
          },
          error: (error) => {
            this.notification.error('Erro ao atualizar cliente');
            console.error(error);
            this.isSubmitting = false;
          },
        });
    } else {
      // Criar
      this.entityService
        .createCliente(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.notification.success('Cliente criado com sucesso');
              this.router.navigate(['/clientes']);
            } else {
              this.notification.error(response.error || 'Erro ao criar cliente');
            }
            this.isSubmitting = false;
          },
          error: (error) => {
            this.notification.error('Erro ao criar cliente');
            console.error(error);
            this.isSubmitting = false;
          },
        });
    }
  }

  onFormCancel() {
    this.router.navigate(['/clientes']);
  }
}
