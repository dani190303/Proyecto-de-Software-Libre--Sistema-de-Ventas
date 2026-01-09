import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './client-list.component.html',
    styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
    clienteService = inject(ClienteService);
    clientes: Cliente[] = [];

    ngOnInit(): void {
        this.cargarClientes();
    }

    cargarClientes() {
        this.clienteService.obtenerClientes().subscribe({
            next: (res) => {
                if (res.success) {
                    this.clientes = res.data;
                }
            },
            error: (err) => console.error(err)
        });
    }

    eliminarCliente(id: number) {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            this.clienteService.eliminarCliente(id).subscribe({
                next: (res) => {
                    if (res.success) {
                        alert('Cliente eliminado');
                        this.cargarClientes();
                    }
                },
                error: (err) => alert('Error al eliminar')
            });
        }
    }
}
