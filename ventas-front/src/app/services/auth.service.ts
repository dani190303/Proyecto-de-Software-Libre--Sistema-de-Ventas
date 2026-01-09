import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private apiUrl = 'http://localhost:3000/api/usuarios';
    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());

    user$ = this.userSubject.asObservable();

    constructor() { }

    private getUserFromStorage() {
        const user = localStorage.getItem('dssl_user');
        return user ? JSON.parse(user) : null;
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((res: any) => {
                if (res.success) {
                    localStorage.setItem('dssl_user', JSON.stringify(res.data));
                    this.userSubject.next(res.data);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('dssl_user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    getCurrentUser() {
        return this.userSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }
}
