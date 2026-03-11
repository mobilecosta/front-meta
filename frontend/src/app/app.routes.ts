/**
 * Configuração de roteamento da aplicação Angular
 */

import { Routes } from '@angular/router';
import { ClientesListComponent } from '../pages/clientes-list.component';
import { ClientesFormComponent } from '../pages/clientes-form.component';
import { ProdutosListComponent } from '../pages/produtos-list.component';
import { ProdutosFormComponent } from '../pages/produtos-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/clientes',
    pathMatch: 'full',
  },
  {
    path: 'clientes',
    component: ClientesListComponent,
  },
  {
    path: 'clientes/novo',
    component: ClientesFormComponent,
  },
  {
    path: 'clientes/:id/editar',
    component: ClientesFormComponent,
  },
  {
    path: 'produtos',
    component: ProdutosListComponent,
  },
  {
    path: 'produtos/novo',
    component: ProdutosFormComponent,
  },
  {
    path: 'produtos/:id/editar',
    component: ProdutosFormComponent,
  },
  {
    path: '**',
    redirectTo: '/clientes',
  },
];
