import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { SaleProcessComponent } from './components/sale-process/sale-process.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { SaleDetailComponent } from './components/sale-detail/sale-detail.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'usuarios', component: UserListComponent },
    { path: 'usuarios/nuevo', component: UserFormComponent },
    { path: 'usuarios/editar/:id', component: UserFormComponent },
    { path: 'clientes', component: ClientListComponent },
    { path: 'clientes/nuevo', component: ClientFormComponent },
    { path: 'clientes/editar/:id', component: ClientFormComponent },
    { path: 'productos', component: ProductListComponent },
    { path: 'productos/nuevo', component: ProductFormComponent },
    { path: 'productos/editar/:id', component: ProductFormComponent },
    { path: 'categorias', component: CategoryListComponent },
    { path: 'categorias/nuevo', component: CategoryFormComponent },
    { path: 'categorias/editar/:id', component: CategoryFormComponent },
    { path: 'ventas', component: SaleProcessComponent },
    { path: 'historial', component: SaleListComponent },
    { path: 'historial/:id', component: SaleDetailComponent },
];
