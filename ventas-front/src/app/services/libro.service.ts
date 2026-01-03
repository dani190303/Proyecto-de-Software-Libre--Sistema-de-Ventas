import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LibroResponse } from '../models/libro.interface';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private apiUrl = `${environment.apiUrl}/libros`;
  constructor(private http:HttpClient) { }

  obtenerLibros(): Observable<LibroResponse>{
    return this.http.get<LibroResponse>(this.apiUrl);
  }
  eliminarLibro(id:any):Observable<LibroResponse>{
    return this.http.delete<LibroResponse>(`${this.apiUrl}/${id}`)
  }

  obtenerLibroPorId(id:any): Observable<LibroResponse>{
    return this.http.get<LibroResponse>(`${this.apiUrl}/${id}`);
  }

}
