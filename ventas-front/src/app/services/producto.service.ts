import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.interface';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/productos';

    getProductos(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getProducto(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createProducto(producto: Producto): Observable<any> {
        return this.http.post<any>(this.apiUrl, producto);
    }

    updateProducto(id: number, producto: Producto): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
    }

    deleteProducto(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
