/**
 * Componente principal da aplicação Angular
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, PoModule],
  template: `
    <po-container>
      <po-page-default p-title="Dynamic CRUD - Sistema de Gerenciamento">
        <po-menu [p-menus]="menus"></po-menu>
        <router-outlet></router-outlet>
      </po-page-default>
    </po-container>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }
    `,
  ],
})
export class AppComponent {
  menus = [
    {
      label: 'Clientes',
      icon: 'po-icon-user',
      link: '/clientes',
    },
    {
      label: 'Produtos',
      icon: 'po-icon-box',
      link: '/produtos',
    },
  ];
}
