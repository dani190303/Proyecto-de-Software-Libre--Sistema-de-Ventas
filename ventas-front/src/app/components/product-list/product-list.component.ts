import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productoService = inject(ProductoService);
  productos: Producto[] = [];

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (res) => {
        if (res.success) {
          this.productos = res.data;
        }
      },
      error: (err) => console.error(err)
    });
  }

  eliminarProducto(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          this.cargarProductos();
          alert('Producto eliminado correctamente (Lógico)');
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar: ' + (err.error?.mensaje || 'No se pudo eliminar el producto'));
        }
      });
    }
  }
}
