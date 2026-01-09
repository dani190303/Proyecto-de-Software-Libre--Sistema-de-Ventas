import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    fb = inject(FormBuilder);
    authService = inject(AuthService);
    router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    errorMessage: string = '';

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (res) => {
                    if (res.success) {
                        // Redirigir al dashboard o ventas
                        this.router.navigate(['/ventas']);
                    }
                },
                error: (err) => {
                    this.errorMessage = err.error.mensaje || 'Error al iniciar sesión';
                }
            });
        }
    }
}
