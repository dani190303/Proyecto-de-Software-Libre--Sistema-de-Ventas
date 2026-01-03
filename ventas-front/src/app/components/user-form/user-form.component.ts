import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  usuario: Usuario = {
    nombres: '',
    apellidos: '',
    username: '',
    password: '',
    rol: 'EMPLEADO'
  };

  editMode = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.editMode = true;
      this.usuarioService.getUsuario(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.usuario = res.data;
            // Limpiar password para no mostrar el hash (opcional)
            this.usuario.password = '';
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  guardarUsuario() {
    if (this.editMode) {
      // En update, si el password está vacío, el backend debería saber no actualizarlo
      // Ojo: En nuestro backend actual siempre actualiza. 
      // Idealmente el backend debería chequear si viene vacío.
      this.usuarioService.updateUsuario(this.usuario.id_usuario!, this.usuario).subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: (err) => console.error(err)
      });
    } else {
      this.usuarioService.createUsuario(this.usuario).subscribe({
        next: () => this.router.navigate(['/usuarios']),
        error: (err) => console.error(err)
      });
    }
  }
}
