import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Producto } from '../../models/producto.interface';
import { Categoria } from '../../models/categoria.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productoService = inject(ProductoService);
  categoriaService = inject(CategoriaService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  categorias: Categoria[] = [];

  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    id_categoria: 0
  };

  editMode = false;

  ngOnInit(): void {
    this.cargarCategorias();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.productoService.getProducto(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.producto = res.data;
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => {
        if (res.success) {
          this.categorias = res.data;
        }
      },
      error: (err) => console.error(err)
    });
  }

  guardarProducto() {
    if (this.editMode) {
      this.productoService.updateProducto(this.producto.id_producto!, this.producto).subscribe({
        next: () => this.router.navigate(['/productos']),
        error: (err) => console.error(err)
      });
    } else {
      this.productoService.createProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/productos']),
        error: (err) => console.error(err)
      });
    }
  }
}
