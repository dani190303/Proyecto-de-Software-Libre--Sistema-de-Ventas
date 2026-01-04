import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.interface';

@Injectable({
    providedIn: 'root'
})
export class VentaService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/ventas';

    createVenta(venta: Venta): Observable<any> {
        return this.http.post<any>(this.apiUrl, venta);
    }

    getVentas(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getVenta(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
}
