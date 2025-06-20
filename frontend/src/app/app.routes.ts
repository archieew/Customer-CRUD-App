import { Routes } from '@angular/router';
import { CustomerList } from './customer-list/customer-list';
import { CustomerForm } from './customer-form/customer-form';
import { CustomerView } from './customer-view/customer-view';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerList },
  { path: 'customers/new', component: CustomerForm },
  { path: 'customers/:id/edit', component: CustomerForm },
  { path: 'customers/:id', component: CustomerView },
];
