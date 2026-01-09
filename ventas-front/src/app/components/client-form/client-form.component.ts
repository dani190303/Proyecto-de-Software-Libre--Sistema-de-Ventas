import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';

@Component({
    selector: 'app-client-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
    clienteService = inject(ClienteService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    cliente: Partial<Cliente> = {
        documento: '',
        nombres: '',
        apellidos: ''
    };

    esEdicion: boolean = false;
    idEditar: number = 0;

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.esEdicion = true;
                this.idEditar = +params['id'];
                this.cargarCliente(this.idEditar);
            }
        });
    }

    cargarCliente(id: number) {
        this.clienteService.obtenerClientePorId(id).subscribe({
            next: (res) => {
                if (res.success) {
                    this.cliente = res.data;
                }
            },
            error: (err) => console.error(err)
        });
    }

    guardarCliente() {
        if (!this.cliente.documento || !this.cliente.nombres || !this.cliente.apellidos) {
            alert('Todos los campos son obligatorios');
            return;
        }

        if (this.esEdicion) {
            this.clienteService.actualizarCliente(this.idEditar, this.cliente).subscribe({
                next: (res) => {
                    if (res.success) {
                        alert('Cliente actualizado correctamente');
                        this.router.navigate(['/clientes']);
                    }
                },
                error: (err) => alert('Error al actualizar: ' + err.message)
            });
        } else {
            this.clienteService.crearCliente(this.cliente).subscribe({
                next: (res) => {
                    if (res.success) {
                        alert('Cliente registrado correctamente');
                        this.router.navigate(['/clientes']);
                    }
                },
                error: (err) => {
                    console.error(err);
                    alert('Error al registrar: ' + (err.error?.mensaje || err.message));
                }
            });
        }
    }
}
