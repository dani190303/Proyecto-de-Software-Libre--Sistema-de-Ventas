import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.interface';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoriaService = inject(CategoriaService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  categoria: Categoria = {
    nombre: ''
  };

  editMode = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.categoriaService.getCategoria(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.categoria = res.data;
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  guardarCategoria() {
    if (this.editMode) {
      this.categoriaService.updateCategoria(this.categoria.id_categoria!, this.categoria).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: (err) => console.error(err)
      });
    } else {
      this.categoriaService.createCategoria(this.categoria).subscribe({
        next: () => this.router.navigate(['/categorias']),
        error: (err) => console.error(err)
      });
    }
  }
}
