import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/categorias';

    getCategorias(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getCategoria(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createCategoria(categoria: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, categoria);
    }

    updateCategoria(id: number, categoria: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, categoria);
    }

    deleteCategoria(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
