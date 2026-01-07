import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.interface';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = 'http://localhost:3000/api/usuarios';

    constructor(private http: HttpClient) { }

    getUsuarios(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getUsuario(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createUsuario(usuario: Usuario): Observable<any> {
        return this.http.post<any>(this.apiUrl, usuario);
    }

    updateUsuario(id: number, usuario: Usuario): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
    }

    deleteUsuario(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
