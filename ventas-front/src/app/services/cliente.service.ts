import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.interface';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private apiUrl = 'http://localhost:3000/api/clientes';

    constructor(private http: HttpClient) { }

    obtenerClientes(): Observable<{ success: boolean, data: Cliente[] }> {
        return this.http.get<{ success: boolean, data: Cliente[] }>(this.apiUrl);
    }

    obtenerClientePorId(id: number): Observable<{ success: boolean, data: Cliente }> {
        return this.http.get<{ success: boolean, data: Cliente }>(`${this.apiUrl}/${id}`);
    }

    crearCliente(cliente: Partial<Cliente>): Observable<any> {
        return this.http.post(this.apiUrl, cliente);
    }

    actualizarCliente(id: number, cliente: Partial<Cliente>): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, cliente);
    }

    eliminarCliente(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    buscarCliente(termino: string): Observable<{ success: boolean, data: Cliente[] }> {
        return this.http.get<{ success: boolean, data: Cliente[] }>(`${this.apiUrl}/buscar/${termino}`);
    }
}
