import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { SaleProcessComponent } from './components/sale-process/sale-process.component';

export const routes: Routes = [
    { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
    { path: 'usuarios', component: UserListComponent },
    { path: 'usuarios/nuevo', component: UserFormComponent },
    { path: 'usuarios/editar/:id', component: UserFormComponent },
    { path: 'productos', component: ProductListComponent },
    { path: 'productos/nuevo', component: ProductFormComponent },
    { path: 'productos/editar/:id', component: ProductFormComponent },
    { path: 'categorias', component: CategoryListComponent },
    { path: 'categorias/nuevo', component: CategoryFormComponent },
    { path: 'categorias/editar/:id', component: CategoryFormComponent },
    { path: 'ventas', component: SaleProcessComponent },
];
