import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.interface';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categoriaService = inject(CategoriaService);
  categorias: Categoria[] = [];

  ngOnInit(): void {
    this.cargarCategorias();
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

  eliminarCategoria(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.cargarCategorias();
          alert('Categoría eliminada correctamente (Si tenía productos, puede haber fallado si no hay borrado lógico en backend)');
        },
        error: (err) => {
          console.error(err);
          alert('Error al eliminar: ' + (err.error?.mensaje || 'No se pudo eliminar la categoría'));
        }
      });
    }
  }
}
