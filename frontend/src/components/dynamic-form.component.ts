/**
 * Componente dinâmico de formulário PO-UI
 * Renderiza formulários baseados em metadados
 */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { Entity, EntityMetadata, FieldMetadata } from '../models/entity.model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PoModule],
  template: `
    <div class="form-container">
      <po-page-default [p-title]="title">
        <po-container>
          <form [formGroup]="form">
            <!-- Renderizar campos dinamicamente -->
            <ng-container *ngFor="let field of visibleFields">
              <!-- String Input -->
              <po-input
                *ngIf="field.type === 'string' && !field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-placeholder]="field.placeholder || ''"
                [p-help]="field.helpText || ''"
                p-readonly
              ></po-input>

              <po-input
                *ngIf="field.type === 'string' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-placeholder]="field.placeholder || ''"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
              ></po-input>

              <!-- Email Input -->
              <po-email
                *ngIf="field.type === 'email' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-placeholder]="field.placeholder || ''"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
              ></po-email>

              <!-- Phone Input -->
              <po-phone
                *ngIf="field.type === 'phone' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-placeholder]="field.placeholder || ''"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
              ></po-phone>

              <!-- Number Input -->
              <po-number
                *ngIf="field.type === 'number' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-placeholder]="field.placeholder || ''"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
                [p-min]="field.min"
                [p-max]="field.max"
              ></po-number>

              <!-- Date Input -->
              <po-date
                *ngIf="field.type === 'date' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
                p-readonly
              ></po-date>

              <!-- DateTime Input -->
              <po-datetime
                *ngIf="field.type === 'datetime' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
                p-readonly
              ></po-datetime>

              <!-- Text Area -->
              <po-textarea
                *ngIf="field.type === 'text' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-placeholder]="field.placeholder || ''"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
                [p-rows]="4"
              ></po-textarea>

              <!-- Select -->
              <po-select
                *ngIf="field.type === 'select' && field.editable && field.options"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-options]="field.options"
                [p-help]="field.helpText || ''"
                [p-required]="field.required"
              ></po-select>

              <!-- Boolean/Checkbox -->
              <po-checkbox
                *ngIf="field.type === 'boolean' && field.editable"
                [formControl]="form.get(field.name)!"
                [p-label]="field.label"
                [p-help]="field.helpText || ''"
              ></po-checkbox>
            </ng-container>
          </form>

          <!-- Action Buttons -->
          <po-container>
            <po-button-group>
              <po-button
                p-label="Salvar"
                p-kind="primary"
                (p-click)="onSubmit()"
                [p-disabled]="!form.valid || isSubmitting"
                [p-loading]="isSubmitting"
              ></po-button>
              <po-button
                p-label="Cancelar"
                p-kind="secondary"
                (p-click)="onCancel()"
              ></po-button>
            </po-button-group>
          </po-container>
        </po-container>
      </po-page-default>
    </div>
  `,
  styles: [
    `
      .form-container {
        padding: 20px;
      }

      po-input,
      po-email,
      po-phone,
      po-number,
      po-date,
      po-datetime,
      po-textarea,
      po-select,
      po-checkbox {
        display: block;
        margin-bottom: 16px;
      }

      po-button-group {
        margin-top: 24px;
      }
    `,
  ],
})
export class DynamicFormComponent implements OnInit {
  @Input() metadata: EntityMetadata | null = null;
  @Input() data: Entity | null = null;
  @Input() isEdit = false;
  @Input() isSubmitting = false;

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  visibleFields: FieldMetadata[] = [];
  title = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.buildForm();
    this.setupTitle();
  }

  private buildForm() {
    if (!this.metadata) return;

    this.visibleFields = this.metadata.fields.filter(
      field => field.visible !== false && field.editable !== false
    );

    const formControls: Record<string, any> = {};

    for (const field of this.visibleFields) {
      let value = this.data ? (this.data as any)[field.name] : null;

      // Inicializar com valor padrão se não estiver editando
      if (!this.isEdit && !value) {
        value = this.getDefaultValue(field);
      }

      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }

      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      if (field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }

      if (field.max !== undefined) {
        validators.push(Validators.max(field.max));
      }

      formControls[field.name] = [
        { value, disabled: !field.editable },
        validators,
      ];
    }

    this.form = this.fb.group(formControls);
  }

  private getDefaultValue(field: FieldMetadata): any {
    switch (field.type) {
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'date':
      case 'datetime':
        return new Date();
      default:
        return '';
    }
  }

  private setupTitle() {
    if (!this.metadata) return;

    if (this.isEdit) {
      this.title = `Editar ${this.metadata.label}`;
    } else {
      this.title = `Novo ${this.metadata.label}`;
    }
  }

  onSubmit() {
    if (!this.form.valid) return;

    const formValue = this.form.getRawValue();
    this.submit.emit(formValue);
  }

  onCancel() {
    this.cancel.emit();
  }
}
